"use client";
import { CheckerDesc } from "@/app/checker/[checkerId]/editor/CheckerDesc";
import { apiClient, handleErr } from "@/trpc/react";
import { type Checker } from "@prisma/client";
import classNames from "classnames";
import Link from "next/link";
import { useEffect, useState } from "react";

export const CheckerStore = (): JSX.Element => {
  const [checkers, setCheckers] = useState<Checker[]>([]);

  useEffect(() => {
    handleErr(apiClient.checker.getAllCheckers.query(), setCheckers);
  }, []);

  return (
    <div className="mt-10 flex flex-col items-center space-y-6">
      {/* TODO: add a search bar */}
      {checkers.map((checker, idx) => {
        return (
          <div key={`storefront-${idx}`}>
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
