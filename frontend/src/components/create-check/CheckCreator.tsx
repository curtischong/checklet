import {
    DeleteButton,
    LoadingButtonSubmit,
    NormalButton,
    SubmittingState,
} from "@components/Button";
import { Input } from "@components/Input";
import { LabelWithHelp } from "@components/LabelWithHelp";
import { SlidingRadioButton } from "@components/SlidingRadioButton";
import { NormalTextArea } from "@components/TextArea";
import { CheckPreview } from "@components/create-check/CheckPreview";
import { NavigationPath } from "@components/NavigationPath";
import {
    CheckBlueprint,
    CheckId,
    CheckType,
    PositiveCheckExample,
    validCheckTypes,
} from "@components/create-checker/CheckerTypes";
import {
    defaultCategory,
    defaultDesc,
    defaultInstructions,
    defaultName,
    feedbackTypeDesc,
} from "@components/create-check/DefaultTextForCheckType";
import { PositiveCheckExampleCreator } from "@components/create-check/PositiveCheckExampleCreator";
import { HelpIcon } from "@components/icons/HelpIcon";
import { useClientContext } from "@utils/ClientContext";
import { SetState } from "@utils/types";
import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { Api } from "@api/apis";
import { FlattenedPositiveExamplePreview } from "@components/create-check/FlattenedPositiveExamplePreview";

interface Props {
    checkId: CheckId;
}

export const CheckCreator = ({ checkId }: Props): JSX.Element => {
    const [name, setName] = React.useState<string>("");
    const [desc, setDesc] = React.useState("");
    const [instruction, setInstruction] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [positiveExamples, setPositiveExamples] = React.useState<
        PositiveCheckExample[]
    >([]);
    const [checkType, setCheckType] = React.useState<CheckType>(
        CheckType.rephrase,
    );
    const [originalText, setOriginalText] = React.useState("");
    const [editedText, setEditedText] = React.useState("");

    const router = useRouter();
    const checkerId = router.query.checkerId as string;
    const { user } = useClientContext();

    const [submittingState, setSubmittingState] = React.useState(
        SubmittingState.NotSubmitting,
    );

    const setInitialCheckBlueprint = useCallback(
        (initialCheckBlueprint: CheckBlueprint) => {
            setName(initialCheckBlueprint.objInfo.name);
            setDesc(initialCheckBlueprint.objInfo.desc);
            setCheckType(initialCheckBlueprint.checkType);
            setInstruction(initialCheckBlueprint.instruction);
            setCategory(initialCheckBlueprint.category);
            setPositiveExamples(initialCheckBlueprint.positiveExamples);
        },
        [],
    );
    useEffect(() => {
        if (!checkerId || !checkId) {
            // TODO: we should just redirect them in the middleware if this is the case
            toast.error("checkerId or checkId is undefined");
            return;
        }

        (async () => {
            if (!user) {
                toast.error("Please log in to edit your check");
                return;
            }
            const checkBlueprint = await Api.fetchCheckBlueprint(checkId, user);
            if (!checkBlueprint) {
                console.warn(
                    `check blueprint not found for checkId=${checkId}`,
                );
                return;
            }
            setInitialCheckBlueprint(checkBlueprint);
        })();
    }, []);

    const [clickedSubmit, setClickedSubmit] = React.useState(false);
    const [err, setErr] = React.useState("");

    const getIncompleteFormErr = useCallback(() => {
        if (name === "") {
            return "Please enter a name";
        } else if (instruction === "") {
            return "Please enter a model instruction";
        } else if (desc === "") {
            return "Please enter a long description";
        } else if (positiveExamples.length === 0) {
            return "Please enter at least one positive example";
        } else {
            return "";
        }
    }, [name, instruction, desc, positiveExamples]);

    useEffect(() => {
        if (!clickedSubmit) {
            return;
        }
        setErr(getIncompleteFormErr());
    }, [getIncompleteFormErr, clickedSubmit]);

    const submitCheck = useCallback(() => {
        setClickedSubmit(true);
        if (!user) {
            return;
        }
        if (getIncompleteFormErr() !== "") {
            return;
        }
        let newPositiveExamples = positiveExamples;
        if (checkType === CheckType.highlight) {
            // remove all of the editedText in the positive examples
            newPositiveExamples = positiveExamples.map((example) => {
                return {
                    originalText: example.originalText,
                };
            });
        }
        if (!name || !checkType) {
            toast("name or checkType is undefined. Let Curtis know!");
            return;
        }

        const checkBlueprint: CheckBlueprint = {
            objInfo: {
                name,
                desc,
                id: checkId,
                creatorId: user.uid,
            },
            checkType,
            instruction,
            category,
            positiveExamples: newPositiveExamples,
        };

        setSubmittingState(SubmittingState.Submitting);
        (async () => {
            await Api.editCheck(checkBlueprint, user);
            setSubmittingState(SubmittingState.Submitted);
            setTimeout(() => {
                setSubmittingState(SubmittingState.NotSubmitting);
            }, 3000);
        })();
    }, [
        name,
        checkType,
        instruction,
        desc,
        category,
        positiveExamples,
        checkId,
        getIncompleteFormErr,
    ]);

    const SubmitCheckText = {
        [`${SubmittingState.NotSubmitting}-create`]: "Create Check",
        [`${SubmittingState.Submitting}-create`]: "Creating Check",
        [`${SubmittingState.Submitted}-create`]: "Check Created!",
        [`${SubmittingState.NotSubmitting}-update`]: "Update Check",
        [`${SubmittingState.Submitting}-update`]: "Updating Check",
        [`${SubmittingState.Submitted}-update`]: "Check Updated!",
    };

    return (
        <div className="flex flex-row mt-4 container mx-auto">
            <div
                className="flex flex-col flex-grow"
                style={{
                    flexBasis: "0",
                }}
            >
                <NavigationPath
                    sections={[
                        {
                            name: "Dashboard",
                            url: "/dashboard",
                        },
                        {
                            name: "Create Checker",
                            url: `/create/checker/${checkerId}`,
                        },
                        {
                            name: "Create Check",
                        },
                    ]}
                />
                <h1 className=" text-3xl font-bold">Create Check</h1>
                <label className="text-lg mt-4 font-bold">Name</label>
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={defaultName[checkType]}
                />

                <CheckSectionHeader
                    label="Suggestion Reason"
                    helpText="This is a great place to explain your suggestion. Users will see this when they expand the card."
                />
                <NormalTextArea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder={defaultDesc[checkType]}
                    minRows={3}
                />
                <CheckSectionHeader
                    label="Model Instructions"
                    helpText="Here is where you tell the model how to edit the text."
                />
                <NormalTextArea
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
                    placeholder={defaultInstructions[checkType]}
                    minRows={4}
                />
                <CheckSectionHeader
                    label="Category (optional)"
                    helpText="If you want to organize your cards by category, you can add a category here."
                />
                <Input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder={defaultCategory[checkType]}
                />

                <div className="mt-4">
                    <CheckSectionHeader
                        label="Positive Examples"
                        helpText="Positive examples helps the model recognize when to apply your check. Because just like humans, computers understand instructions better with examples"
                    />
                    <div className="flex flex-col">
                        {positiveExamples.map((example, idx) => (
                            <div
                                className="flex flex-row"
                                key={`positive-example-${idx}`}
                            >
                                <DeleteButton
                                    onClick={() => {
                                        setPositiveExamples(
                                            positiveExamples.filter(
                                                (_, i) => i !== idx,
                                            ),
                                        );
                                    }}
                                />
                                <FlattenedPositiveExamplePreview
                                    example={example}
                                    checkType={checkType}
                                />
                            </div>
                        ))}
                    </div>
                    <PositiveCheckExampleCreator
                        checkType={checkType}
                        onCreate={(newExample) => {
                            setPositiveExamples([
                                ...positiveExamples,
                                newExample,
                            ]);
                        }}
                        originalText={originalText}
                        setOriginalText={setOriginalText}
                        editedText={editedText}
                        setEditedText={setEditedText}
                    />
                </div>

                <div className="text-[#ff0000] mt-4 ">{err}</div>

                <div className="mt-4 flex flex-row space-x-4">
                    <LoadingButtonSubmit
                        isLoading={
                            submittingState === SubmittingState.Submitting
                        }
                        onClick={submitCheck}
                        className="w-40"
                    >
                        {
                            SubmitCheckText[
                                `${submittingState}-${
                                    router.query.isNew ? "create" : "update"
                                }`
                            ]
                        }
                    </LoadingButtonSubmit>
                    <NormalButton
                        className="w-56 py-[4px]"
                        onClick={() => {
                            router.push(`/create/checker/${checkerId}`);
                        }}
                    >
                        Return to Create Checker
                    </NormalButton>
                </div>
                <div className="h-20"></div>
            </div>

            <div
                className="flex-grow min-w-0"
                // flex basis isn't supported in this version of tailwind
                style={{
                    flexBasis: "0",
                }}
            >
                <div className="fixed mx-auto w-[350px] left-[50%] right-0 mt-10">
                    {/* use flex-col to prevent thsi radio buttonf rom taking up the full width */}
                    <div className="flex flex-col">
                        <SlidingRadioButton
                            options={validCheckTypes}
                            selected={checkType}
                            setSelected={setCheckType as SetState<string>}
                            className="mx-auto mb-4"
                        />
                    </div>
                    <div className="flex flex-row">
                        <div className="text-xl font-bold ml-1 mb-4">
                            {checkType} Check
                        </div>
                        <HelpIcon
                            className="ml-2 mt-[7px]"
                            text={feedbackTypeDesc(checkType)}
                        />
                    </div>
                    <CheckPreview
                        blueprint={{
                            objInfo: {
                                name,
                                desc,
                                id: checkId,
                                creatorId: user?.uid ?? "",
                            },
                            checkType,
                            instruction,
                            category,
                            positiveExamples,
                        }}
                        originalText={originalText}
                        editedText={editedText}
                    />
                </div>
            </div>
        </div>
    );
};

interface CheckSectionHeaderProps {
    label: string;
    helpText: string;
}
const CheckSectionHeader = ({ label, helpText }: CheckSectionHeaderProps) => {
    return (
        <LabelWithHelp
            label={label}
            helpText={helpText}
            className="mt-2 font-bold text-lg"
            helpIconClassName="mt-[7px]"
        />
    );
};
