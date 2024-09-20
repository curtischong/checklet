/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";

import { checkDoc } from "@/server/api/routers/checker/checkDoc";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { type PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const MAX_CHECKERS = 10;

const getCheckerById = async (db: PrismaClient, id: string) => {
  const checker = await db.checker.findUnique({
    where: { id },
  });
  if (!checker) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "checker not found",
    });
  }
  return checker;
};
export type CheckerType = ReturnType<typeof getCheckerById>;

export const checkerRouter = createTRPCRouter({
  getBlueprint: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.checker.findUnique({
        where: { id: input.id },
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
        name: "",
        desc: "",
        prompt: "",
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

    return newChecker;
  }),

  update: protectedProcedure
    .input(z.object({ id: z.string() }))
    .input(z.object({ name: z.string() }))
    .input(z.object({ desc: z.string() }))
    .input(z.object({ prompt: z.string() }))
    .input(z.object({ isPublic: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      // TODO: veritfy that YOU own the checker
      const isValid =
        input.name !== "" && input.desc !== "" && input.prompt !== "";

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
          isPublic: input.isPublic,
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
  checkDoc: publicProcedure
    .input(z.object({ doc: z.string() }))
    .input(z.object({ checkerId: z.string() }))
    .query(async ({ ctx, input }) => {
      const checker = await getCheckerById(ctx.db, input.checkerId);
      if (!checker) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "checker not found",
        });
      }
      if (
        !checker.isPublic &&
        (!ctx.user || checker.createdById !== ctx.user.id) // if you are not logged in, or not the cretor, you can't use this private checker
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "you are not the creator of this checker",
        });
      }
      if (!checker.isValid) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "this checker is not valid",
        });
      }

      // now that we've validated everything, we can actually check the doc
      return await checkDoc(input.doc, checker);
    }),
});
