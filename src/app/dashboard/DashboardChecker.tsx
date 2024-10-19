"use client";
import {
  DeleteButtonWithConfirm,
  EditButton,
  TextButton,
} from "@/app/_components/ui/Button";
import { Tooltip } from "@/app/_components/ui/ToolTip";
import { AccessTypeSelector } from "@/app/checker/[checkerId]/edit/AccessTypeSelector";
import { CheckerDesc } from "@/app/checker/[checkerId]/editor/CheckerDesc";
import { useTrpcCtx } from "@/app/TrpcCtx";
import { type UserCtx } from "@/firebase/edge_env";
import { handleErr } from "@/trpc/react";
import { type Checker } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface Props {
  user: UserCtx;
  blueprint: Checker;
  onDeleteChecker: () => void;
}

// this is how your checker looks like in your dashboard page
export const DashboardChecker = ({
  user,
  blueprint,
  onDeleteChecker,
}: Props): JSX.Element => {
  const router = useRouter();
  const { trpcClient } = useTrpcCtx();

  return (
    <div className="mb-10 flex flex-col rounded-md bg-white px-6 pb-3 pt-4 shadow-around">
      <div className="flex flex-row">
        <div className="font-mackinac text-xl font-bold">
          {blueprint.name === "" ? "Untitled Checker" : blueprint.name}
        </div>
        <div className="between-x-0 ml-auto flex flex-row">
          <Tooltip title="Edit Checker">
            <EditButton
              className="px-2"
              onClick={() => {
                const checkerId = blueprint.id;
                router.push(`/checker/${checkerId}/edit`);
              }}
            />
          </Tooltip>
          <DeleteButtonWithConfirm
            onDelete={() => {
              if (!user) {
                toast.error("You must be logged in to delete a checker");
                return;
              }
              // call trpc to delete the checker
              handleErr(
                trpcClient.checker.delete.mutate({
                  checkerId: blueprint.id,
                }),
                onDeleteChecker,
              );
            }}
          />
        </div>
      </div>
      <CheckerDesc isHeightCapped={true} desc={blueprint.desc} />
      <div className="mt-2 flex cursor-default flex-row items-start">
        <div className="mt-2 flex-grow">
          <AccessTypeSelector
            checkerId={blueprint.id}
            initialAccessType={blueprint.accessType}
          />
        </div>
        <TextButton
          className="self-start"
          onClick={() => router.push(`/checker/${blueprint.id}`)}
        >
          Open in Editor
        </TextButton>
      </div>
    </div>
  );
};
