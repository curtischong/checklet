"use client";

import {
  DerpChecklet,
  MushyChecklet,
  PennyChecklet,
} from "@/app/_components/checklets/checklets";
import { NormalButton } from "@/app/_components/ui/Button";
import { DashboardChecker } from "@/app/dashboard/DashboardChecker";
import { type UserCtx } from "@/firebase/edge_env";
import { type GetUserCheckersType } from "@/server/api/routers/checker/checker";
import { apiClient, handleErr } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface Props {
  user: UserCtx;
  // checkers: UserCheckersType;
}

// used to show you your checkers.
export const Dashboard = ({ user }: Props) => {
  // export const Dashboard = () => {
  const [currCheckers, setCurrCheckers] = useState<GetUserCheckersType>([]);

  useEffect(() => {
    handleErr(apiClient.checker.getUserCheckers.query(), (checkers) => {
      setCurrCheckers(checkers);
    });
  }, []);
  const router = useRouter();

  const createChecker = useCallback(() => {
    handleErr(apiClient.checker.create.mutate(), (checker) => {
      router.push(`/checker/${checker.id}/edit`);
    });
  }, [router]);

  return (
    <div className="flex">
      <div className="container mx-auto ml-20 mt-20">
        {/* {user ? user.email : <></>} */}
        <p className="font-mackinac text-2xl font-bold">Your Checkers</p>
        <div className="mx-auto ml-0 mt-4 w-[450px]">
          {currCheckers.map((checkerBlueprint, idx) => {
            return (
              <div key={`checker-${idx}`}>
                <DashboardChecker
                  user={user}
                  blueprint={checkerBlueprint}
                  onDeleteChecker={() => {
                    setCurrCheckers(
                      currCheckers.filter((c) => c.id !== checkerBlueprint.id),
                    );
                  }}
                />
              </div>
            );
          })}
        </div>
        <NormalButton onClick={createChecker}>Create Checker</NormalButton>
        {/* the div is to provide some buffer */}
        <div className="h-32" />
        <PennyChecklet className="absolute bottom-[15rem] right-[40%] h-[7rem]" />
        <MushyChecklet className="absolute right-[30%] top-[30vh] h-[5rem]" />
        <DerpChecklet className="absolute bottom-[10rem] right-[10%] h-[5rem]" />
      </div>
    </div>
  );
};
