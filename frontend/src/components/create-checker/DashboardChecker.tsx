import { Api } from "@api/apis";
import { DeleteButtonWithConfirm, EditButton } from "@components/Button";
import { LabelWithSwitch } from "@components/Switch";
import { CheckerBlueprint } from "@components/create-checker/CheckerTypes";
import { useClientContext } from "@utils/ClientContext";
import { useRouter } from "next/router";
import { useState } from "react";
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
    const [tmpChecked, setTmpChecked] = useState<boolean>(blueprint.isPublic);
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
                    {blueprint.objInfo.name}
                </div>
                <div className="ml-auto flex flex-row between-x-0">
                    <EditButton
                        className="px-2"
                        onClick={() => {
                            router.push({
                                pathname: "/create-checker",
                                query: {
                                    checkerId: blueprint.objInfo.id,
                                },
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
            <div className="flex flex-row mt-4 cursor-default space-x-2">
                <LabelWithSwitch
                    text="Is Public:"
                    helpText="Public checkers are discoverable and usable by anybody. People may reverse-engineer your prompts if you make it public"
                    isChecked={tmpChecked}
                    setChecked={(newIsChecked: boolean) => {
                        (async () => {
                            if (!user) {
                                toast.error(
                                    "You must be logged in to change a checker's privacy",
                                );
                                return;
                            }
                            setTmpChecked(newIsChecked); // if we don't set this initially, the switch wont' change state
                            const success = await Api.setCheckerIsPublic(
                                blueprint.objInfo.id,
                                newIsChecked,
                                user,
                            );
                            if (!success) {
                                setTmpChecked(!newIsChecked);
                            }
                        })();
                    }}
                />
            </div>
        </div>
    );
};
