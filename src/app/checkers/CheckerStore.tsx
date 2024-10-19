"use client";
import { CheckerDesc } from "@/app/checker/[checkerId]/editor/CheckerDesc";
import { useClientCtx } from "@/app/ClientCtx";
import { useTrpcCtx } from "@/app/TrpcCtx";
import { handleErr } from "@/trpc/react";
import { type Checker } from "@prisma/client";
import classNames from "classnames";
import Link from "next/link";
import { useEffect, useState } from "react";

export const CheckerStore = (): JSX.Element => {
  const [checkers, setCheckers] = useState<Checker[]>([]);
  const [userCheckers, setUserCheckers] = useState<Checker[]>([]);
  const { trpcClient } = useTrpcCtx();
  const { user } = useClientCtx();

  useEffect(() => {
    handleErr(trpcClient.checker.getAllCheckers.query(), (checkers) => {
      const userCheckers = [];
      const nonUserCheckers = [];
      for (const checker of checkers) {
        if (checker.createdById === user?.id) {
          userCheckers.push(checker);
        } else {
          nonUserCheckers.push(checker);
        }
      }
      setCheckers(nonUserCheckers);
      setUserCheckers(userCheckers);
    });
  }, []);

  if (!user) {
    return (
      <div className="mt-10 flex flex-col items-center space-y-6">
        {checkers.map((checker) => {
          return (
            <div key={checker.id}>
              <StoreFront checker={checker} />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="mt-10 flex flex-col items-center space-y-6">
      {/* TODO: add a search bar */}
      {user && (
        <h2 className="text-center font-mackinac text-2xl font-bold">
          Your Checkers
        </h2>
      )}
      {userCheckers ? (
        <div className="flex flex-col space-y-4">
          {userCheckers.map((checker) => {
            return (
              <div key={checker.id}>
                <StoreFront checker={checker} />
              </div>
            );
          })}
        </div>
      ) : (
        <h2>You have no checkers</h2>
      )}
      <h2 className="text-center font-mackinac text-2xl font-bold">
        Public Checkers
      </h2>
      {checkers.map((checker) => {
        return (
          <div key={checker.id}>
            <StoreFront checker={checker} />
          </div>
        );
      })}
    </div>
  );
};

interface StorefrontProps {
  checker: Checker;
  isDemo?: boolean; // used for the landing page
}

export const StoreFront = ({ checker, isDemo }: StorefrontProps) => {
  return (
    <div
      className={classNames(
        "rounded-md bg-white px-4 py-4 text-left shadow-around",
        {
          "max-w-[475px] cursor-pointer": !isDemo,
          "max-w-[350px]": isDemo,
        },
      )}
    >
      <Link
        href={isDemo ? "" : `/checker/${checker.id}`}
        aria-disabled={isDemo}
        tabIndex={isDemo ? -1 : undefined}
        className={isDemo ? "pointer-events-none" : ""}
      >
        <div className="mb-1 font-mackinac text-xl font-bold">
          {checker.name === "" ? "Untitled" : checker.name}
        </div>
        <CheckerDesc
          isHeightCapped={true}
          desc={checker.desc.trim() === "" ? "No description" : checker.desc}
        />
      </Link>
    </div>
  );
};
