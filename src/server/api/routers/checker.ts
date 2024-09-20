import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const checkerRouter = createTRPCRouter({
  getBlueprint: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.checker.findUnique({
        where: { id: input.id },
      });
    }),

  create: protectedProcedure.mutation(async ({ ctx }) => {
    return ctx.db.checker.create({
      data: {
        name: "",
        desc: "",
        prompt: "",
        createdById: ctx.user.id,
      },
    });
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

  ensureTypeInferenceWorks: protectedProcedure.query(() => {
    return "makes the router's return types clear because TypeScript can infer the type of the response from this procedure";
  }),
});
