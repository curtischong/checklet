/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  onSignup: protectedProcedure.mutation(async ({ ctx }) => {
    const user = ctx.user;
    const existingUser = await ctx.db.user.findUnique({
      where: {
        email: user.email,
      },
    });
    console.log(`onSignup ${user.email}`);
    if (existingUser) {
      console.warn(
        `${user.email} called onSignup. but their user already exists in the db`,
      );
      if (existingUser.id !== user.id) {
        console.warn(
          `existing user id is ${existingUser.id} but the new user id is ${user.id}. Maybe we cleared their account on firebase, but not the DB`,
        );
        // honestly. do nothing. I think this ppl can't abuse this endpoint since the only way to get the UserCtx is ia an authenticated token
      }
      return;
    }

    await ctx.db.user.create({
      data: {
        id: user.id,
        email: user.email,
      },
    });
  }),
});
