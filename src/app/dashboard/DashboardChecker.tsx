import {
  DeleteButtonWithConfirm,
  EditButton,
} from "@/app/_components/ui/Button";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

interface Props {
  blueprint: CheckerBlueprint;
  fetchCheckerBlueprints: () => void;
}

// this is how your checker looks like in your dashboard page
export const DashboardChecker = ({
  blueprint,
  fetchCheckerBlueprints,
}: Props): JSX.Element => {
  const { user } = useClientContext();
  const router = useRouter();

  // display: flex;
  // width: 100%;
  // border-radius: 5px;
  // box-shadow: 0px 10px 36px rgba(0, 0, 0, 0.08);
  // padding: 10px 10px;
  // margin-bottom: 20px;
  // animation: closed 0.075s linear 0.3s forwards;

  return (
    <div className="shadow-around mb-10 flex flex-col rounded-md bg-white px-6 pb-3 pt-4">
      <div className="flex flex-row">
        <div className="font-mackinac text-xl font-bold">
          {blueprint.objInfo.name === ""
            ? "Untitled Checker"
            : blueprint.objInfo.name}
        </div>
        <div className="between-x-0 ml-auto flex flex-row">
          <EditButton
            className="px-2"
            onClick={() => {
              const checkerId = blueprint.objInfo.id;
              router.push({
                pathname: `/create/checker/${checkerId}`,
              });
            }}
          />
          <DeleteButtonWithConfirm
            onDelete={async () => {
              if (!user) {
                toast.error("You must be logged in to delete a checker");
                return;
              }
              Api.deleteChecker(blueprint.objInfo.id, user).then(
                fetchCheckerBlueprints,
              );
            }}
          />
        </div>
      </div>
      <div>{blueprint.objInfo.desc}</div>
      <div className="mt-2 flex cursor-default flex-row items-start">
        <div className="mt-2 flex-grow">
          <IsPublicSwitch
            name={blueprint.objInfo.name}
            desc={blueprint.objInfo.desc}
            placeholder={blueprint.placeholder}
            checkStatuses={blueprint.checkStatuses}
            checkerId={blueprint.objInfo.id}
            isPublic={blueprint.isPublic}
          />
        </div>
        <TextButton
          className="self-start"
          onClick={() =>
            router.push({
              pathname: `/editor/${blueprint.objInfo.id}`,
            })
          }
        >
          Open in Editor
        </TextButton>
      </div>
    </div>
  );
};
function useClientContext(): { user: any } {
  throw new Error("Function not implemented.");
}
