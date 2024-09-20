/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  onSignup: protectedProcedure.mutation(async ({ ctx }) => {
    console.log("onSignup");
    const user = ctx.user;
    const existingUser = await ctx.db.user.findUnique({
      where: {
        email: user.email,
      },
    });
    if (!existingUser) {
      await ctx.db.user.create({
        data: {
          id: user.id,
          email: user.email,
        },
      });
    }
  }),

  // create: protectedProcedure.mutation(async ({ ctx }) => {
  //   return ctx.db.checker.create({
  //     data: {
  //       name: "",
  //       desc: "",
  //       prompt: "",
  //       createdById: ctx.user.id,
  //     },
  //   });
  // }),
});
