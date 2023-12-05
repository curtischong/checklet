import { Api } from "@api/apis";
import { DeleteButtonWithConfirm } from "@components/Button";
import { LabelWithSwitch } from "@components/Switch";
import { CheckerBlueprint } from "@components/create-checker/CheckerTypes";
import { useClientContext } from "@utils/ClientContext";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

interface Props {
    blueprint: CheckerBlueprint;
    fetchCheckerBlueprints: () => void;
}
export const DashboardChecker = ({
    blueprint,
    fetchCheckerBlueprints,
}: Props): JSX.Element => {
    const { user } = useClientContext();
    const [tmpChecked, setTmpChecked] = useState<boolean>(blueprint.isPublic);

    // display: flex;
    // width: 100%;
    // border-radius: 5px;
    // box-shadow: 0px 10px 36px rgba(0, 0, 0, 0.08);
    // padding: 10px 10px;
    // margin-bottom: 20px;
    // animation: closed 0.075s linear 0.3s forwards;

    return (
        <div className=" flex flex-col shadow-around rounded-md px-6 pt-4 pb-3 mb-10">
            <Link
                className="font-bold text-xl"
                href={{
                    pathname: "/create-checker",
                    query: {
                        checkerId: blueprint.id,
                    },
                }}
            >
                {blueprint.name}
            </Link>
            <div>{blueprint.desc}</div>
            <div className="flex flex-row mt-4 cursor-default space-x-2">
                <LabelWithSwitch
                    text="Is Public:"
                    helpText="If a checker is public, anyone discover and use it. If it's private, only you can know about it and use it."
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
                                blueprint.id,
                                newIsChecked,
                                await user.getIdToken(),
                            );
                            if (!success) {
                                setTmpChecked(!newIsChecked);
                            }
                        })();
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
                        Api.deleteChecker(
                            blueprint.id,
                            await user.getIdToken(),
                        ).then(() => {
                            fetchCheckerBlueprints();
                        });
                    }}
                />
            </div>
        </div>
    );
};
