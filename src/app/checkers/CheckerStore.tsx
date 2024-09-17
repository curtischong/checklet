import { Checker } from "@prisma/client";
import classNames from "classnames";

interface Props {
  checkers: Checker[];
}

export const CheckerStore = ({ checkers }: Props): JSX.Element => {
  return (
    <div className="flex flex-col items-center mt-10 space-y-6">
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
        "bg-white rounded-md px-4 py-4 shadow-around text-left",
        {
          "cursor-pointer max-w-[475px] ": !isDemo,
          "max-w-[350px]": isDemo,
        },
      )}
      href={isDemo ? "" : `/checker/${checker.id}`}
    >
      <div className="text-xl font-bold mb-1 font-mackinac">{checker.name}</div>
      <div>{checker.desc}</div>
    </Link>
  );
};
