import { type Checker } from "@prisma/client";
import classNames from "classnames";
import Link from "next/link";

interface Props {
  checkers: Checker[];
}

export const CheckerStore = ({ checkers }: Props): JSX.Element => {
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
    <Link
      className={classNames(
        "shadow-around rounded-md bg-white px-4 py-4 text-left",
        {
          "max-w-[475px] cursor-pointer": !isDemo,
          "max-w-[350px]": isDemo,
        },
      )}
      href={isDemo ? "" : `/checker/${checker.id}/edit`}
    >
      <div className="mb-1 font-mackinac text-xl font-bold">{checker.name}</div>
      <div>{checker.desc}</div>
    </Link>
  );
};
