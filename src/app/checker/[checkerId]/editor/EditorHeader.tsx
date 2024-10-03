import Popconfirm from "@/app/_components/ui/PopConfirm";
import { type CheckerStorefront } from "@/app/checker/[checkerId]/edit/CheckerTypes";
import { type GetCheckerByIdStrictType } from "@/server/api/routers/checker/checker";
import { apiClient, handleErr } from "@/trpc/react";
import { type SetState } from "@/utils/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  storefront: CheckerStorefront;
  editorState: string;
  setEditorState: SetState<string>;
}

// we make a request to get the clonedFrom checker here. this is so the rest of the page is loaded faster (doesn't need to wait for this second request)
export const EditorHeader = ({
  storefront,
  editorState,
  setEditorState,
}: Props): JSX.Element => {
  const [clonedFromChecker, setClonedFromChecker] =
    useState<GetCheckerByIdStrictType | null>(null);
  const pathName = usePathname();

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
        <div className="flex flex-row items-center">
          <div className="my-auto flex-grow font-mackinac text-3xl">
            {storefront.name}
          </div>
          {/* <button
            className={classNames(
              `h-7 rounded border border-gray-400 px-1 text-gray-600 transition duration-300`,
              "hover:bg-[#5384d4] hover:text-white focus:bg-[#43b56c] focus:text-white",
            )}
            onClick={() => {
              // if (editorState !== "") {
              // }
            }}
          >
            Try with Demo Document
          </button> */}

          {/* only show this in the editor page. Since the sampledoc is the same doc in the create checker page! */}
          {!pathName.endsWith("/edit") && (
            <Popconfirm
              title="Clear your document with the sample doc?"
              onConfirm={() => {
                setEditorState(storefront.sampleDoc);
              }}
              autoConfirmOnPress={editorState === ""}
              className="cursor-pointer rounded border border-gray-400 px-1 text-center text-gray-600 transition duration-300 hover:bg-[#5384d4] hover:text-white focus:bg-[#43b56c] focus:text-white"
            >
              Try with Sample Doc
            </Popconfirm>
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
        <div className="text-md">
          <p>{storefront.desc}</p>
        </div>
      </div>
      <hr className="mb-4 mt-1 h-[1px] w-full border-none bg-black" />
    </div>
  );
};
