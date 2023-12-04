import { Api } from "@api/apis";
import { DeleteButton } from "@components/Button";
import { LabelWithSwitch } from "@components/Switch";
import { CheckerBlueprint } from "@components/create-checker/CheckerTypes";
import { useClientContext } from "@utils/ClientContext";
import { Popconfirm } from "antd";
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

    return (
        <div className="w-32 flex flex-row">
            <Popconfirm title={"Confirm Delete"}>
                <DeleteButton
                    onClick={async () => {
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
            </Popconfirm>
            <Link
                href={{
                    pathname: "/create-checker",
                    query: {
                        checkerId: blueprint.id,
                    },
                }}
            >
                {blueprint.name}
            </Link>
            <LabelWithSwitch
                text="isPublic"
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
        </div>
    );
};
