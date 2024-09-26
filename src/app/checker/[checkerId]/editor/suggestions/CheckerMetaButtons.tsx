"use client";
import { NormalButton } from "@/app/_components/ui/Button";
import { useClientCtx } from "@/app/ClientCtx";
import { apiClient, handleErr } from "@/trpc/react";
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
        <NormalButton
          className="mb-4 py-[4px]"
          onClick={() => {
            router.push(`/checker/${checkerId}/edit`);
          }}
        >
          Edit this Checker
        </NormalButton>
      )}
      <NormalButton
        className="mb-4 py-[4px]"
        onClick={() => {
          if (!userId) {
            // TODO: redirect to signin if they are not logged in
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
        Don't agree with this Checker's suggestions? Modify it by cloning it
        here!
      </NormalButton>
    </>
  );
};
