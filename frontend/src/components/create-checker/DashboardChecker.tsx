import { Api } from "@api/apis";
import {
    DeleteButtonWithConfirm,
    EditButton,
    TextButton,
} from "@components/Button";
import { CheckerBlueprint } from "@components/create-checker/CheckerTypes";
import { IsPublicSwitch } from "@components/create-checker/IsPublicSwitch";
import { useClientContext } from "@utils/ClientContext";
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
        <div className=" flex flex-col shadow-around rounded-md px-6 pt-4 pb-3 mb-10 bg-white ">
            <div className="flex flex-row">
                <div className="font-bold text-xl">
                    {blueprint.objInfo.name === ""
                        ? "Untitled Checker"
                        : blueprint.objInfo.name}
                </div>
                <div className="ml-auto flex flex-row between-x-0">
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
                                toast.error(
                                    "You must be logged in to delete a checker",
                                );
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
            <div className=" mt-4 cursor-default flex flex-row items-center">
                <IsPublicSwitch
                    name={blueprint.objInfo.name}
                    desc={blueprint.objInfo.desc}
                    checkStatuses={blueprint.checkStatuses}
                    checkerId={blueprint.objInfo.id}
                    isPublic={blueprint.isPublic}
                />
                <TextButton
                    className="ml-8"
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
