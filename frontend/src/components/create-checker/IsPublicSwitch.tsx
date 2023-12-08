import { Api } from "@api/apis";
import { CheckerId } from "@api/checker";
import { LabelWithSwitch } from "@components/Switch";
import { CheckStatuses } from "@components/create-checker/CheckerTypes";
import { useClientContext } from "@utils/ClientContext";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Props {
    isPublic: boolean;
    checkerId: CheckerId;
    name: string;
    desc: string;
    checkStatuses: CheckStatuses;
}

export const IsPublicSwitch = ({
    isPublic,
    checkerId,
    name,
    desc,
    checkStatuses,
}: Props): JSX.Element => {
    const [clickedIsPublic, setClickedIsPublic] = useState(false);
    const [tmpChecked, setTmpChecked] = useState<boolean>(isPublic);
    const [err, setErr] = useState("");
    const { user } = useClientContext();

    useEffect(() => {
        setTmpChecked(isPublic);
    }, [isPublic]);

    // TODO: use for changing isPublic
    const getIncompleteFormErr = useCallback(() => {
        if (name === "") {
            return "Please enter a name";
        } else if (desc === "") {
            return "Please enter a description";
        } else if (Object.keys(checkStatuses).length === 0) {
            return "Please enter at least one check";
        } else if (
            !Object.values(checkStatuses).some((status) => status.isEnabled)
        ) {
            return "Please enable at least one check";
        } else {
            return "";
        }
    }, [name, desc, JSON.stringify(checkStatuses)]);

    useEffect(() => {
        const newErr = getIncompleteFormErr();
        if (newErr !== "") {
            setTmpChecked(false);
        }
        setErr(newErr);
    }, [getIncompleteFormErr]);

    return (
        <>
            <div className="text-[#ff0000] mt-4 ">
                {clickedIsPublic ? err : ""}
            </div>
            <LabelWithSwitch
                text="Is Public:"
                helpText="Public checkers are discoverable and usable by anybody. People may reverse-engineer your prompts if you make it public"
                isChecked={tmpChecked}
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
                        const success = await Api.setCheckerIsPublic(
                            checkerId,
                            newIsChecked,
                            user,
                        );
                        if (!success) {
                            setTmpChecked(!newIsChecked);
                        }
                    })();
                }}
            />
        </>
    );
};
