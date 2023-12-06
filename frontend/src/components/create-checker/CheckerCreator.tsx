import {
    LoadingButtonSubmit,
    NormalButton,
    SubmittingState,
} from "@components/Button";
import { HelpIcon } from "@components/icons/HelpIcon";
import { Input } from "antd";
import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { useClientContext } from "@utils/ClientContext";
import { Api } from "@api/apis";
import { RightArrowIcon } from "@components/icons/RightArrowIcon";
import { NormalTextArea } from "@components/TextArea";
import {
    CheckBlueprint,
    CheckStatuses,
    CheckerBlueprint,
} from "@components/create-checker/CheckerTypes";
import { CheckOverview } from "@components/create-checker/CheckOverview";

export enum Page {
    Main,
    CheckCreator,
}

const SubmitButtonText = {
    [SubmittingState.NotSubmitting]: "Create Checker",
    [SubmittingState.Submitting]: "Creating Checker",
    [SubmittingState.Submitted]: "Checker Created!",
};
interface Props {
    checkerId: string;
}

export const CheckerCreator = ({ checkerId }: Props): JSX.Element => {
    const [name, setName] = React.useState("");
    const [desc, setDesc] = React.useState("");
    const [checkStatuses, setCheckStatuses] = React.useState<CheckStatuses>({});
    const [submittingState, setSubmittingState] = React.useState(
        SubmittingState.NotSubmitting,
    );
    const [isPublic, setIsPublic] = React.useState(false);
    const [checkBlueprints, setCheckBlueprints] = React.useState<
        CheckBlueprint[]
    >([]);
    const { user } = useClientContext();

    const [err, setErr] = React.useState("");
    const [clickedIsPublic, setClickedIsPublic] = React.useState(false);

    const router = useRouter();

    // fetch the checker blueprint from the server
    useEffect(() => {
        if (!user) {
            return;
        }
        (async () => {
            const res = await Api.fetchCheckerBlueprint(
                checkerId as string,
                user,
            );
            if (!res) {
                toast.error("Failed to fetch checker");
                return;
            }
            const { checkerBlueprint, checkBlueprints } = res;
            setName(checkerBlueprint.objInfo.name);
            setDesc(checkerBlueprint.objInfo.desc);
            setCheckStatuses(checkerBlueprint.checkStatuses);
            setIsPublic(checkerBlueprint.isPublic);
            setCheckBlueprints(checkBlueprints);
        })();
    }, [user]);

    // TODO: use for changing isPublic
    const getIncompleteFormErr = useCallback(() => {
        if (name === "") {
            return "Please enter a name";
        } else if (desc === "") {
            return "Please enter a description";
        } else if (Object.keys(checkStatuses).length === 0) {
            return "Please enter at least one check";
        } else {
            return "";
        }
    }, [name, desc, checkStatuses]);

    useEffect(() => {
        if (!clickedIsPublic) {
            return;
        }
        setErr(getIncompleteFormErr());
    }, [getIncompleteFormErr, clickedIsPublic]);

    const editChecker = useCallback(() => {
        setClickedIsPublic(true);
        if (getIncompleteFormErr() !== "") {
            return;
        }
        if (!user) {
            toast.error("You must be logged in to create a checker");
            return;
        }

        const checker: CheckerBlueprint = {
            objInfo: {
                name,
                desc,
                creatorId: user.uid,
                id: checkerId,
            },
            checkStatuses,
            isPublic,
        };

        // const checkerId =
        //     "1f981bc8190cc7be55aea57245e5a0aa255daea3e741ea9bb0153b23881b6161"; // use this if you want to test security rules
        setSubmittingState(SubmittingState.Submitting);
        (async () => {
            await Api.editChecker(checker, user);
            setSubmittingState(SubmittingState.Submitted);
            setTimeout(() => {
                setSubmittingState(SubmittingState.NotSubmitting);
            }, 3000);
        })();
    }, [name, desc, checkStatuses, user, checkerId]);

    return (
        <div className="flex justify-center ">
            <div className="container">
                return (
                <div className="flex flex-col w-[450px]">
                    <div className="flex flex-row items-center">
                        <p
                            className="text-gray-400 cursor-pointer  transition duration-300 hover:text-gray-600"
                            onClick={() => {
                                router.push("/dashboard");
                            }}
                        >
                            Dashboard
                        </p>
                        <RightArrowIcon className="mx-2 w-[14px]" />
                        <p className="font-bold text-gray-600">
                            Create checker
                        </p>
                    </div>

                    <h1 className="text-xl font-bold mt-10">Create Checker</h1>

                    <label className="text-lg">Name</label>
                    <Input
                        placeholder="Rizzume"
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                        value={name}
                    />

                    <label className="text-lg">Description</label>
                    <NormalTextArea
                        placeholder="Rizzume will rizz up your resume to dazzle any employer. It will make points sharp and salient. All to make you sound impressive."
                        onChange={(e) => {
                            setDesc(e.target.value);
                        }}
                        value={desc}
                        minRows={3}
                    />

                    <div className="flex flex-row mt-2">
                        <h1 className="font-bold text-xl mt-4">Checks</h1>
                        <HelpIcon
                            className="mt-[22px] ml-2"
                            text={
                                "These are the individual checks your checker runs on the document. "
                            }
                        />
                    </div>
                    <div className="mt-4 space-y-4">
                        {checkBlueprints.map((checkBlueprint, idx) => (
                            <CheckOverview
                                key={`check-${idx}`}
                                checkBlueprint={checkBlueprint}
                                onDelete={() => {
                                    const newChecks = [...checkBlueprints];
                                    newChecks.splice(idx, 1);
                                    setCheckBlueprints(newChecks);
                                }}
                                onEdit={() => {
                                    setPage(Page.CheckCreator, {
                                        initialCheckBlueprint: checkBlueprint,
                                    });
                                }}
                            />
                        ))}
                    </div>
                    <NormalButton
                        className="mt-8 w-80"
                        onClick={() => {
                            setPage(Page.CheckCreator);
                        }}
                    >
                        Create Check
                    </NormalButton>

                    <div className="text-[#ff0000] mt-4 ">{err}</div>
                    <LoadingButtonSubmit
                        isLoading={
                            submittingState === SubmittingState.Submitting
                        }
                        onClick={editChecker}
                        className="mt-4 w-80 h-10"
                    >
                        {SubmitButtonText[submittingState]}
                    </LoadingButtonSubmit>
                    <div className="h-10"></div>
                </div>
                );
            </div>
        </div>
    );
};
