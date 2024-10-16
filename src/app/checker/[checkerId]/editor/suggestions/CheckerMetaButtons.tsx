"use client";
import { HelpIcon } from "@/app/_components/icons/HelpIcon";
import Popconfirm from "@/app/_components/ui/PopConfirm";
import { type CheckerStorefront } from "@/app/checker/[checkerId]/edit/CheckerTypes";
import { useClientCtx } from "@/app/ClientCtx";
import { useTrpcCtx } from "@/app/TrpcCtx";
import { handleErr } from "@/trpc/react";
import classNames from "classnames";
import { useRouter } from "next/navigation";
interface Props {
  editorState: string;
  storefront: CheckerStorefront;
  checkerCreatorId: string;
  onTryWithSampleDoc: () => void;
}

export const CheckerMetaButtons = ({
  editorState,
  storefront,
  checkerCreatorId,
  onTryWithSampleDoc,
}: Props) => {
  const router = useRouter();
  const { user } = useClientCtx();
  const userId = user?.id;
  const isUserCreatorOfChecker = userId === checkerCreatorId;
  const checkerId = storefront.checkerId;
  const { trpcClient } = useTrpcCtx();

  return (
    <>
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
      {isUserCreatorOfChecker && (
        // don't make this a link because they may open multiple tabs. This may lead to race conditions if they edit in the wrong tab
        <button
          className={classNames(
            `rounded border border-gray-400 px-1 text-gray-600 transition duration-300`,
            "hover:bg-[#5384d4] hover:text-white",
          )}
          onClick={() => {
            router.push(`/checker/${checkerId}/edit`);
          }}
        >
          Edit Checker
        </button>
      )}
      <div className={`flex flex-row`}>
        <button
          onClick={() => {
            if (!userId) {
              router.push(`/signin?redirect-reason=clone-checker`);
            } else {
              handleErr(
                trpcClient.checker.clone.mutate({
                  checkerId,
                }),
                (newChecker) => {
                  router.push(`/checker/${newChecker.id}/edit`);
                },
              );
            }
          }}
        >
          Clone
        </button>
        <HelpIcon
          className={classNames("ml-2")}
          text={`Don't agree with this Checker's suggestions? Modify it by cloning it here!`}
          placement="bottom-end"
        />
      </div>
    </>
  );
};
