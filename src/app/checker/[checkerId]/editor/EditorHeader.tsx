import Popconfirm from "@/app/_components/ui/PopConfirm";
import { type CheckerStorefront } from "@/app/checker/[checkerId]/edit/CheckerTypes";
import { type GetCheckerByIdStrictType } from "@/server/api/routers/checker/checker";
import { apiClient, handleErr } from "@/trpc/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
              autoConfirmOnPress={
                editorState === "" || editorState === storefront.sampleDoc
              }
              onConfirm={onTryWithSampleDoc}
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

        {/* we need the markdown class to help us with tailwind css issues: https://stackoverflow.com/questions/74607419/react-markdown-don%C2%B4t-render-markdown */}
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          className="markdown space-y-[0px]"
          components={{
            a: ({ ...props }) => (
              <a
                className="cursor-pointer border-b-2 border-blue-500 hover:text-blue-600"
                {...props}
              />
            ),
          }}
        >
          {storefront.desc}
        </ReactMarkdown>
      </div>
      <hr className="mb-4 mt-1 h-[1px] w-full border-none bg-black" />
    </div>
  );
};
