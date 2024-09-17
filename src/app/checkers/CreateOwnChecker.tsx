"use client";
import { api } from "@/trpc/react";
import { UserCtx } from "next-auth";
import { useRouter } from "next/router";

interface Props {
  user?: UserCtx;
}

export const CreateOwnChecker = ({ user }: Props) => {
  const router = useRouter();
  const createChecker = api.checker.create.useMutation({
    onSuccess: async (checker) => {
      router.push(`/checker/create/${checker.id}`);
    },
  });

  return (
    <div className="mx-auto mt-2">
      Can&lsquo;t find a checker you like?{" "}
      <div
        // ref="/create/checker"
        className="mx-auto mt-4 border-b-2 border-blue-500 hover:text-blue-600"
        onClick={() => {
          if (!user) {
            router.push(
              "/login?err='you must be logged in to create a checker'",
            );
          } else {
            createChecker.mutate();
          }
        }}
      >
        Create your own Checker
      </div>
    </div>
  );
};
