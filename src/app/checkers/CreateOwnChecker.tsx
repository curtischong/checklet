"use client";
import { type UserCtx } from "@/firebase/edge_env";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

interface Props {
  user?: UserCtx;
}

export const CreateOwnChecker = ({ user }: Props) => {
  const router = useRouter();
  const createChecker = api.checker.create.useMutation({
    onSuccess: (checker) => {
      router.push(`/checker/create/${checker.id}`);
    },
  });

  return (
    <div className="mx-auto mt-2">
      Can&lsquo;t find a checker you like?{" "}
      <span
        className="mx-auto mt-4 cursor-pointer border-b-2 border-blue-500 hover:text-blue-600"
        onClick={() => {
          if (!user) {
            router.push("/signin");
          } else {
            createChecker.mutate();
          }
        }}
      >
        Create your own Checker
      </span>
    </div>
  );
};
