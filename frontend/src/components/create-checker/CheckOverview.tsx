import { Api } from "@api/apis";
import { CheckerId } from "@api/checker";
import { DeleteButtonWithConfirm, EditButton } from "@components/Button";
import { LabelWithSwitch } from "@components/Switch";
import { FlattenedPositiveExamplePreview } from "@components/create-check/FlattenedPositiveExamplePreview";
import {
    CheckBlueprint,
    CheckStatuses,
} from "@components/create-checker/CheckerTypes";
import { useClientContext } from "@utils/ClientContext";
import { SetState } from "@utils/types";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Props {
    checkBlueprint: CheckBlueprint;
    checkerId: CheckerId;
    onDelete: () => void;
    onEdit: () => void;
    checkStatuses: CheckStatuses;
    setCheckStatuses: (newCs: CheckStatuses) => void;
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
    const [err, setErr] = useState("");
    const [clickedIsPublic, setClickedIsPublic] = useState(false);

    useEffect(() => {
        setTmpChecked(checkStatuses[checkId].isEnabled);
    }, [checkStatuses[checkId]]);

    const getIncompleteFormErr = useCallback(() => {
        if (checkBlueprint.objInfo.name === "") {
            return "Please enter a name";
        } else if (checkBlueprint.instruction === "") {
            return "Please enter a model instruction";
        } else if (checkBlueprint.objInfo.desc === "") {
            return "Please enter a long description";
        } else if (checkBlueprint.positiveExamples.length === 0) {
            return "Please enter at least one positive example";
        } else {
            return "";
        }
    }, [checkBlueprint]); // since the blueprint never changes after rendering, it's okay to not JSON.stringify it in the dep array
    useEffect(() => {
        const newErr = getIncompleteFormErr();
        if (newErr !== "") {
            setTmpChecked(false);
        }
        setErr(newErr);
    }, [getIncompleteFormErr]);

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
            {/* <h2 className="font-bold mt-5">Positive Examples</h2>
            <div className="flex flex-col">
                {checkBlueprint.positiveExamples.map((example, idx) => (
                    <div className="flex flex-row" key={`example-${idx}`}>
                        <FlattenedPositiveExamplePreview
                            example={example}
                            checkType={checkBlueprint.checkType}
                        />
                    </div>
                ))}
            </div> */}
            <div className="text-[#ff0000] mt-4 ">
                {clickedIsPublic ? err : ""}
            </div>
            <LabelWithSwitch
                className="mt-4"
                text="Is Enabled:"
                helpText="The checker only runs enables checks on the document"
                isChecked={tmpIsChecked}
                setChecked={(newIsChecked: boolean) => {
                    setClickedIsPublic(true);
                    if (newIsChecked && err !== "") {
                        return;
                    }
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
