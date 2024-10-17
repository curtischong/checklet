/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";

import { type UserCtx } from "@/firebase/edge_env";
import { mixpanel } from "@/mixpanel";
import { checkDoc4Dot12OpenAi } from "@/server/api/routers/checker/checkDoc";
import { openaiLlm } from "@/server/api/routers/checker/openaiLlm";
import { inference6Dot3 } from "@/server/api/routers/checker/prompts";
import { regenSuggestion } from "@/server/api/routers/checker/regenSuggestion";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { type Prisma, type PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
const MAX_CHECKERS = 10;

export const getCheckerById = async (db: PrismaClient, id: string) => {
  const checker = await db.checker.findUnique({
    where: { id },
  });
  return checker;
};
export type GetCheckerByIdType = Awaited<ReturnType<typeof getCheckerById>>;

export const getCheckerByIdStrict = async (db: PrismaClient, id: string) => {
  const checker = await getCheckerById(db, id);
  if (!checker) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "checker not found",
    });
  }
  return checker;
};
export type GetCheckerByIdStrictType = Awaited<
  ReturnType<typeof getCheckerByIdStrict>
>;

const getUserCheckers = async (db: PrismaClient, user: UserCtx) => {
  return await db.checker.findMany({
    where: {
      createdById: {
        equals: user.id,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
};
export type GetUserCheckersType = Awaited<ReturnType<typeof getUserCheckers>>;

const isCheckerValid = (name: string, desc: string, prompt: string) => {
  return name !== "" && desc !== "" && prompt !== "";
  // input.sampleDoc !== ""; // TODO: should we care about the sample doc?
};

export const checkerRouter = createTRPCRouter({
  getCheckerById: publicProcedure
    .input(z.object({ checkerId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await getCheckerByIdStrict(ctx.db, input.checkerId);
    }),

  getUserCheckers: protectedProcedure.query(async ({ ctx }) => {
    return await getUserCheckers(ctx.db, ctx.user);
  }),

  getUserChecker: protectedProcedure
    .input(z.object({ checkerId: z.string() }))
    .query(async ({ ctx, input }) => {
      const checker = await getCheckerByIdStrict(ctx.db, input.checkerId);
      if (checker.createdById !== ctx.user.id) {
        // this is important because if the checker is private, we don't want some random person to be able to see it
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "you are not the creator of this checker",
        });
      }
      return checker;
    }),

  getAllCheckers: publicProcedure.query(async ({ ctx }) => {
    console.log("getAllCheckers");
    const targetClauses: Prisma.CheckerWhereInput[] = [
      {
        isPublic: {
          equals: true,
        },
        isValid: {
          equals: true,
        },
      },
    ];
    if (ctx.user) {
      const yourCheckerClause: Prisma.CheckerWhereInput = {
        createdById: {
          equals: ctx.user.id,
        },
      };
      targetClauses.push(yourCheckerClause);
    }

    return await ctx.db.checker.findMany({
      where: { OR: targetClauses },
    });
  }),

  create: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: {
        id: ctx.user.id,
      },
    });
    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "user not found",
      });
    }
    if (user.checkerIds.length >= MAX_CHECKERS) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: `you can only have ${MAX_CHECKERS} checkers! Contact Curtis if you want more`,
      });
    }

    const newChecker = await ctx.db.checker.create({
      data: {
        createdById: ctx.user.id,
      },
    });

    // finally push the new checker to the user's checkerIds array
    await ctx.db.user.update({
      where: {
        id: ctx.user.id,
      },
      data: {
        checkerIds: {
          push: newChecker.id,
        },
      },
    });

    mixpanel.track("Create Checker", {
      newCheckerId: newChecker.id,
      email: user.email,
      userId: user.id,
    });

    return newChecker;
  }),

  update: protectedProcedure
    .input(z.object({ id: z.string() }))
    .input(z.object({ name: z.string() }))
    .input(z.object({ desc: z.string() }))
    .input(z.object({ prompt: z.string() }))
    .input(z.object({ sampleDoc: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const isValid = isCheckerValid(input.name, input.desc, input.prompt);

      const checker = await ctx.db.checker.findUnique({
        where: {
          id: input.id,
        },
      });
      if (!checker) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "checker not found",
        });
      }
      if (checker.createdById !== ctx.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "you are not the creator of this checker",
        });
      }

      return ctx.db.checker.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          desc: input.desc,
          prompt: input.prompt,
          sampleDoc: input.sampleDoc,
          isValid,
        },
      });
    }),

  updateIsPublic: protectedProcedure
    .input(z.object({ id: z.string() }))
    .input(z.object({ isPublic: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.checker.update({
        where: {
          id: input.id,
        },
        data: {
          isPublic: input.isPublic,
        },
      });
    }),

  checkDocStreaming: publicProcedure
    .input(z.object({ doc: z.string() }))
    .input(z.object({ checkerId: z.string() }))
    // use mutate over query to make this a POST request. This is required since for GET requests, we encode the doc in the URL, which is too big and causes 414 errors
    .subscription(async function* ({ ctx, input }) {
      // listen for new events
      const checker = await getCheckerByIdStrict(ctx.db, input.checkerId);
      if (
        !checker.isPublic &&
        (!ctx.user || checker.createdById !== ctx.user.id) // if you are not logged in, or not the creator, you can't use this private checker
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "you are not the creator of this checker",
        });
      }
      if (!checker.isValid) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "This checker is not valid. Does it have a name, description, and prompt?",
        });
      }
      const iterator = openaiLlm.streamCompletion(
        [],
        inference6Dot3(checker.prompt, input.doc),
      );
      // for await (const res of logStream(iterator)) {
      for await (const res of iterator) {
        yield res;
      }
    }),

  checkDocImproving: publicProcedure
    .input(z.object({ doc: z.string() }))
    .input(z.object({ checkerId: z.string() }))
    .input(z.object({ thoughtProcess: z.string() }))
    // use mutate over query to make this a POST request. This is required since for GET requests, we encode the doc in the URL, which is too big and causes 414 errors
    .mutation(async ({ ctx, input }) => {
      // console.log("checkDocimproving", input);
      const checker = await getCheckerByIdStrict(ctx.db, input.checkerId);
      if (
        !checker.isPublic &&
        (!ctx.user || checker.createdById !== ctx.user.id) // if you are not logged in, or not the creator, you can't use this private checker
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "you are not the creator of this checker",
        });
      }
      if (!checker.isValid) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "This checker is not valid. Does it have a name, description, and prompt?",
        });
      }

      return checkDoc4Dot12OpenAi(
        openaiLlm,
        checker.prompt,
        input.doc,
        input.thoughtProcess,
      );
    }),

  delete: protectedProcedure
    .input(z.object({ checkerId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const checker = await ctx.db.checker.findUnique({
        where: {
          id: input.checkerId,
        },
      });
      if (!checker) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "checker not found",
        });
      }

      if (checker.createdById !== ctx.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "you are not the creator of this checker. You cannot delete it",
        });
      }

      const user = await ctx.db.user.findUnique({
        where: {
          id: ctx.user.id,
        },
      });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "user not found",
        });
      }

      // remove the checker
      await ctx.db.checker.delete({
        where: {
          id: input.checkerId,
        },
      });

      // remove this checker id from the user's checkerIds array
      const newUserCheckerIds = user.checkerIds.filter(
        (id) => id !== input.checkerId,
      );
      await ctx.db.user.update({
        where: {
          id: ctx.user.id,
        },
        data: {
          checkerIds: newUserCheckerIds,
        },
      });
    }),

  clone: protectedProcedure
    .input(z.object({ checkerId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          id: ctx.user.id,
        },
      });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "user not found",
        });
      }
      if (user.checkerIds.length >= MAX_CHECKERS) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: `you can only have ${MAX_CHECKERS} checkers! Contact Curtis if you want more`,
        });
      }

      const baseChecker = await ctx.db.checker.findUnique({
        where: {
          id: input.checkerId,
        },
      });
      if (!baseChecker) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `the checker you're trying to clone from not found. id=${input.checkerId}`,
        });
      }

      // checker creators can clone their own checkers
      const newChecker = await ctx.db.checker.create({
        data: {
          createdById: ctx.user.id,
          name: baseChecker.name + " (clone)",
          desc: baseChecker.desc,
          prompt: baseChecker.prompt,
          sampleDoc: baseChecker.sampleDoc,
          isValid: isCheckerValid(
            baseChecker.name,
            baseChecker.desc,
            baseChecker.prompt,
          ),
          clonedFromId: baseChecker.id,
        },
      });

      // finally push the new checker to the user's checkerIds array
      await ctx.db.user.update({
        where: {
          id: ctx.user.id,
        },
        data: {
          checkerIds: {
            push: newChecker.id,
          },
        },
      });

      mixpanel.track("Clone Checker", {
        newCheckerId: newChecker.id,
        clonedFromId: baseChecker.id,
        email: user.email,
        userId: user.id,
      });

      return newChecker;
    }),

  // https://trpc.io/docs/client/links/httpBatchStreamLink#generators
  improvePrompt: protectedProcedure
    .input(z.object({ improvementPrompt: z.string() }))
    // eslint-disable-next-line @typescript-eslint/require-await
    .subscription(async function* ({ input }) {
      const iterator = openaiLlm.streamCompletion([], input.improvementPrompt);
      // for await (const res of logStream(iterator)) {
      for await (const res of iterator) {
        yield res;
      }
    }),
  regenSuggestion: publicProcedure
    .input(
      z.object({
        oldText: z.string(),
        newText: z.string().optional(),
        suggestionName: z.string(),
        suggestionReason: z.string(),
        oldDocWithContext: z.string(),
        regeneratePrompt: z.string(),
      }),
    )
    .mutation(({ input }) => {
      return regenSuggestion(
        input.oldText,
        input.newText,
        input.suggestionName,
        input.suggestionReason,
        input.oldDocWithContext,
        input.regeneratePrompt,
      );
    }),
});
