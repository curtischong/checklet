"use client";
import { NormalButton } from "@/app/_components/ui/Button";
import { useRouter } from "next/navigation";
interface Props {
  checkerId: string;
  userId: string | undefined;
  checkerCreatorId: string;
}

export const CheckerMetaButtons = ({
  checkerId,
  userId,
  checkerCreatorId,
}: Props) => {
  const router = useRouter();
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
            router.push(`/signin`);
          } else {
            router.push(`/checker/${checkerId}/edit`);
          }
        }}
      >
        Don't agree with this Checker's suggestions? Modify it by cloning it
        here!
      </NormalButton>
    </>
  );
};
