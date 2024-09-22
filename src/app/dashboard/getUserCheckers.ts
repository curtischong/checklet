import { type UserCtx } from "@/firebase/edge_env";
import { type PrismaClient } from "@prisma/client";

export const getUserCheckers = async (db: PrismaClient, user: UserCtx) => {
  return await db.checker.findMany({
    where: {
      createdById: {
        equals: user.id,
      },
    },
  });
};

export type UserCheckersType = Awaited<ReturnType<typeof getUserCheckers>>;
