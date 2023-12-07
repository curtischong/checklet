import { Api } from "@api/apis";
import { DeleteButtonWithConfirm, EditButton } from "@components/Button";
import { LabelWithSwitch } from "@components/Switch";
import { PositiveExamplePreview } from "@components/create-check/PositiveExamplePreview";
import { CheckBlueprint } from "@components/create-checker/CheckerTypes";
import { useClientContext } from "@utils/ClientContext";
import { useState } from "react";
import { toast } from "react-toastify";

interface Props {
    checkBlueprint: CheckBlueprint;
    onDelete: () => void;
    onEdit: () => void;
}

// These are the checks you see when you're creating your checker
export const CheckOverview = ({
    checkBlueprint,
    onDelete,
    onEdit,
}: Props): JSX.Element => {
    const [tmpIsChecked, setTmpChecked] = useState(checkBlueprint.isEnabled);

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
                {/* TODO: do a diff, so we see the red deletion / green insertion */}
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
                            checkBlueprint.objInfo.id,
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
    );
};
