import { type CheckerStorefront } from "@/app/checker/[checkerId]/edit/CheckerTypes";
import { type GetCheckerByIdStrictType } from "@/server/api/routers/checker/checker";
import { apiClient, handleErr } from "@/trpc/react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Props {
  storefront: CheckerStorefront;
}

// we make a request to get the clonedFrom checker here. this is so the rest of the page is loaded faster (doesn't need to wait for this second request)
export const EditorHeader = ({ storefront }: Props): JSX.Element => {
  const [clonedFromChecker, setClonedFromChecker] =
    useState<GetCheckerByIdStrictType | null>(null);

  useEffect(() => {
    if (storefront.clonedFromId === null) {
      return;
    }

    handleErr(
      apiClient.checker.getCheckerById.query({
        checkerId: storefront.clonedFromId,
      }),
      (checker) => {
        setClonedFromChecker(checker);
      },
    );
  }, [storefront]);

  return (
    <div>
      <div className="mt-[0px] flex flex-col pt-[20px]">
        <div className="flex flex-row">
          <div className="my-auto flex-grow font-mackinac text-3xl">
            {storefront.name}
          </div>
        </div>
        {clonedFromChecker && (
          <div className="my-auto mb-2 flex-grow font-mackinac text-sm">
            <span className="text-gray-500">Cloned from </span>
            <Link href={`/checker/${clonedFromChecker.id}`}>
              <span className="text-blue-500">{clonedFromChecker.name}</span>
            </Link>
          </div>
        )}
        <div className="text-md">
          <p>{storefront.desc}</p>
        </div>
      </div>
      <hr className="mb-4 mt-1 h-[1px] w-full border-none bg-black" />
    </div>
  );
};
