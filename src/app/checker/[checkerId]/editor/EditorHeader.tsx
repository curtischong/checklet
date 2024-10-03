import Popconfirm from "@/app/_components/ui/PopConfirm";
import { type CheckerStorefront } from "@/app/checker/[checkerId]/edit/CheckerTypes";
import { type GetCheckerByIdStrictType } from "@/server/api/routers/checker/checker";
import { apiClient, handleErr } from "@/trpc/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type RefObject, useEffect, useState } from "react";
import { type RichTextareaHandle } from "rich-textarea";

interface Props {
  storefront: CheckerStorefront;
  editorState: string;
  editorRef: RefObject<RichTextareaHandle | null>;
}

// we make a request to get the clonedFrom checker here. this is so the rest of the page is loaded faster (doesn't need to wait for this second request)
export const EditorHeader = ({
  storefront,
  editorState,
  editorRef,
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

          {/* only show this in the editor page. Since the sampledoc is the same doc in the create checker page! */}
          {!pathName.endsWith("/edit") && (
            <Popconfirm
              title="Clear your document with the sample doc?"
              onConfirm={() => {
                // DO NOT just call setEditorState so the user can undo this action with ctrl + z
                if (!editorRef.current) {
                  return;
                }
                // do NOT return early. we want the user's cursor to jump to the end so it feels like clicking the button did something
                // if (editorState === storefront.sampleDoc) {
                //   return;
                // }

                // clear the entire editor and insert the sample doc
                editorRef.current.focus();
                editorRef.current.setSelectionRange(
                  0,
                  editorRef.current.value.length,
                );
                // this is deprecated but it works!
                document.execCommand("insertText", false, storefront.sampleDoc);
              }}
              autoConfirmOnPress={
                editorState === "" || editorState === storefront.sampleDoc
              }
              className="mr-4 cursor-pointer rounded border border-gray-400 px-1 text-center text-gray-600 transition duration-300 hover:bg-[#5384d4] hover:text-white focus:bg-[#43b56c] focus:text-white"
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
