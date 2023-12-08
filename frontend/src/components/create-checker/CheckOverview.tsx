import { Api } from "@api/apis";
import { CheckerId } from "@api/checker";
import { DeleteButtonWithConfirm, EditButton } from "@components/Button";
import { LabelWithSwitch } from "@components/Switch";
import { PositiveExamplePreview } from "@components/create-check/PositiveExamplePreview";
import {
    CheckBlueprint,
    CheckStatuses,
} from "@components/create-checker/CheckerTypes";
import { useClientContext } from "@utils/ClientContext";
import { SetState } from "@utils/types";
import { useState } from "react";
import { toast } from "react-toastify";

interface Props {
    checkBlueprint: CheckBlueprint;
    checkerId: CheckerId;
    onDelete: () => void;
    onEdit: () => void;
    checkStatuses: CheckStatuses;
    setCheckStatuses: SetState<CheckStatuses>;
}

// These are the checks you see when you're creating your checker
export const CheckOverview = ({
    checkBlueprint,
    checkerId,
    onDelete,
    onEdit,
    checkStatuses,
    setCheckStatuses,
}: Props): JSX.Element => {
    const checkId = checkBlueprint.objInfo.id;
    const [tmpIsChecked, setTmpChecked] = useState(
        checkStatuses[checkId].isEnabled,
    );

    const { user } = useClientContext();
    return (
        <div className="border bg-white rounded-md shadow-around py-3 px-6 w-[400px]">
            <div className="flex flex-row items-end">
                <div className="text-xl border-b-4 border-solid border-blue-300">
                    {checkBlueprint.objInfo.name}
                </div>
                <div className="ml-4 mb-[2px]">{checkBlueprint.category}</div>
                <div className="ml-auto flex flex-row between-x-0">
                    <EditButton className="px-2" onClick={onEdit} />
                    <DeleteButtonWithConfirm
                        className="px-2 mr-[-10px]"
                        onDelete={onDelete}
                    />
                </div>
            </div>
            {/* <h2>{checkBlueprint.instruction}</h2> */}
            <h2 className="mt-4">{checkBlueprint.objInfo.desc}</h2>
            <h2 className="font-bold mt-5">Positive Examples</h2>
            <div className="flex flex-col">
                {checkBlueprint.positiveExamples.map((example, idx) => (
                    <div className="flex flex-row" key={`example-${idx}`}>
                        <PositiveExamplePreview
                            example={example}
                            checkType={checkBlueprint.checkType}
                        />
                    </div>
                ))}
            </div>
            <LabelWithSwitch
                className="mt-6"
                text="Is Enabled:"
                helpText="The checker only runs enables checks on the document"
                isChecked={tmpIsChecked}
                setChecked={(newIsChecked: boolean) => {
                    (async () => {
                        if (!user) {
                            toast.error(
                                "You must be logged in to change a checker's privacy",
                            );
                            return;
                        }
                        setTmpChecked(newIsChecked); // if we don't set this initially, the switch wont' change state
                        const success = await Api.setCheckIsEnabled(
                            checkId,
                            checkerId,
                            newIsChecked,
                            user,
                        );
                        if (success) {
                            checkStatuses[checkId].isEnabled = newIsChecked;
                            setCheckStatuses(checkStatuses);
                        } else {
                            setTmpChecked(!newIsChecked);
                        }
                    })();
                }}
            />
        </div>
    );
};
