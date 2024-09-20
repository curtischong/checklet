import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  onSignup: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;
    const res = await ctx.db.user.findUnique({
      where: {
        email: user.email,
      },
    });
    // const res = ctx.db.user.findUnique({
    //   where: {
    //     email: user.email,
    //   },
    // });
    if (!res) {
      try {
        return (await ctx.db.user.create({
          data: {
            id: user.id,
            email: user.email,
          },
        })) as User;
      } catch (error) {
        console.error("Error creating user:", error);
        return { error: "Failed to create user" }; // Customize the return value as needed
      }
    }
  }),

  ensureTypeInferenceWorks: protectedProcedure.query(() => {
    return "makes the router's return types clear because TypeScript can infer the type of the response from this procedure";
  }),
});
