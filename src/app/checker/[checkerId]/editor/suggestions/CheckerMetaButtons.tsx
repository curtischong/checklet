"use client";
import { HelpIcon } from "@/app/_components/icons/HelpIcon";
import { useClientCtx } from "@/app/ClientCtx";
import { apiClient, handleErr } from "@/trpc/react";
import classNames from "classnames";
import { useRouter } from "next/navigation";
interface Props {
  checkerId: string;
  checkerCreatorId: string;
}

export const CheckerMetaButtons = ({ checkerId, checkerCreatorId }: Props) => {
  const router = useRouter();
  const { user } = useClientCtx();
  const userId = user?.id;
  const isUserCreatorOfChecker = userId === checkerCreatorId;
  return (
    <>
      {isUserCreatorOfChecker && (
        <button
          className={classNames(
            `rounded border border-gray-400 px-1 text-gray-600 transition duration-300`,
            "hover:bg-[#5384d4] hover:text-white focus:bg-[#43b56c] focus:text-white",
          )}
          onClick={() => {
            router.push(`/checker/${checkerId}/edit`);
          }}
        >
          Edit Prompt
        </button>
      )}
      <div className={`flex flex-row`}>
        <button
          onClick={() => {
            if (!userId) {
              router.push(`/signin?redirect-reason=clone-checker`);
            } else {
              handleErr(
                apiClient.checker.clone.mutate({
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
