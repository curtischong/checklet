"use client";

import { NormalButton } from "@/app/_components/ui/Button";
import { DashboardChecker } from "@/app/dashboard/DashboardChecker";
import { type UserCheckersType } from "@/app/dashboard/getUserCheckers";
import { type UserCtx } from "@/firebase/edge_env";
import { apiClient, handleErr } from "@/trpc/react";
import DerpChecklet from "@public/checklets/derp.svg";
import MushyChecklet from "@public/checklets/mushy.svg";
import PennyChecklet from "@public/checklets/penny.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface Props {
  user: UserCtx;
  checkers: UserCheckersType;
}

// used to show you your checkers.
export const Dashboard = ({ checkers, user }: Props) => {
  const [currCheckers, setCurrCheckers] = useState(checkers);
  const router = useRouter();

  const createChecker = useCallback(() => {
    handleErr(apiClient.checker.create.mutate(), (checker) => {
      router.push(`/checker/${checker.id}/edit`);
    });
  }, [router]);

  return (
    <div className="flex">
      <div className="container mx-auto mt-20">
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
        <Image
          alt="PennyChecklet"
          src={PennyChecklet.src}
          width={200}
          height={200}
          className="absolute bottom-[15rem] right-[40%] h-[7rem]"
        />
        <Image
          alt="MushyChecklet"
          src={MushyChecklet.src}
          width={200}
          height={200}
          className="absolute right-[30%] top-[30vh] h-[5rem]"
        />
        <Image
          alt="DerpChecklet"
          src={DerpChecklet.src}
          width={200}
          height={200}
          className="absolute bottom-[10rem] right-[10%] h-[5rem]"
        />
      </div>
    </div>
  );
};
