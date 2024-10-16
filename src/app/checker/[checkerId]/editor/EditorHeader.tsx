import { type CheckerStorefront } from "@/app/checker/[checkerId]/edit/CheckerTypes";
import { CheckerDesc } from "@/app/checker/[checkerId]/editor/CheckerDesc";
import { CheckerMetaButtons } from "@/app/checker/[checkerId]/editor/suggestions/CheckerMetaButtons";
import { useTrpcCtx } from "@/app/TrpcCtx";
import { type GetCheckerByIdStrictType } from "@/server/api/routers/checker/checker";
import { handleErr } from "@/trpc/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  storefront: CheckerStorefront;
  editorState: string;
  onTryWithSampleDoc: () => void;
}

// we make a request to get the clonedFrom checker here. this is so the rest of the page is loaded faster (doesn't need to wait for this second request)
export const EditorHeader = ({
  storefront,
  editorState,
  onTryWithSampleDoc,
}: Props): JSX.Element => {
  const [clonedFromChecker, setClonedFromChecker] =
    useState<GetCheckerByIdStrictType | null>(null);
  const pathName = usePathname();
  const { trpcClient } = useTrpcCtx();

  useEffect(() => {
    if (storefront.clonedFromId === null) {
      return;
    }

    handleErr(
      trpcClient.checker.getCheckerById.query({
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
        <div className="flex flex-row items-center">
          <div className="my-auto flex-grow font-mackinac text-3xl">
            {storefront.name}
          </div>

          {/* only show this in the editor page. Since the sampledoc is the same doc in the create checker page! */}
          {!pathName.endsWith("/edit") && (
            <>
              <div className="flex flex-row space-x-3">
                <CheckerMetaButtons
                  editorState={editorState}
                  onTryWithSampleDoc={onTryWithSampleDoc}
                  storefront={storefront}
                  checkerCreatorId={storefront.creatorId}
                />
              </div>
            </>
          )}
        </div>
        {clonedFromChecker && (
          <div className="my-auto mb-2 flex-grow font-mackinac text-sm">
            <span className="text-gray-500">Cloned from </span>
            <Link href={`/checker/${clonedFromChecker.id}`}>
              <span className="text-blue-500">{clonedFromChecker.name}</span>
            </Link>
          </div>
        )}

        <CheckerDesc desc={storefront.desc} isHeightCapped={false} />
      </div>
      <hr className="mb-4 mt-1 h-[1px] w-full border-none bg-black" />
    </div>
  );
};
