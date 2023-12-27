import {
    MAX_CHECK_CATEGORY_LEN,
    MAX_CHECK_DESC_LEN,
    MAX_CHECK_INSTR_LEN,
    MAX_CHECK_NAME_LEN,
} from "@/constants";
import { Api } from "@api/apis";
import { DeleteButton, NormalButton } from "@components/Button";
import { Input } from "@components/Input";
import { LabelWithHelp } from "@components/LabelWithHelp";
import { NavigationPath } from "@components/NavigationPath";
import { SlidingRadioButton } from "@components/SlidingRadioButton";
import { NormalTextArea } from "@components/TextArea";
import { CheckPreview } from "@components/create-check/CheckPreview";
import {
    defaultCategory,
    defaultDesc,
    defaultInstructions,
    defaultName,
    feedbackTypeDesc,
} from "@components/create-check/DefaultTextForCheckType";
import { FlattenedPositiveExamplePreview } from "@components/create-check/FlattenedPositiveExamplePreview";
import { PositiveCheckExampleCreator } from "@components/create-check/PositiveCheckExampleCreator";
import {
    CheckBlueprint,
    CheckId,
    CheckType,
    PositiveCheckExample,
    SaveStatusText,
    SubmittingState,
    validCheckTypes,
} from "@components/create-checker/CheckerTypes";
import { HelpIcon } from "@components/icons/HelpIcon";
import { useClientContext } from "@utils/ClientContext";
import { SetState } from "@utils/types";
import debounce from "lodash.debounce";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";
import { toast } from "react-toastify";

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

    const [hasInitialCheckBeenFetched, setHasInitialCheckBeenFetched] =
        React.useState(false);

    const setInitialCheckBlueprint = useCallback(
        (initialCheckBlueprint: CheckBlueprint) => {
            setName(initialCheckBlueprint.objInfo.name);
            setDesc(initialCheckBlueprint.objInfo.desc);
            setCheckType(initialCheckBlueprint.checkType);
            setInstruction(initialCheckBlueprint.instruction);
            setCategory(initialCheckBlueprint.category);
            setPositiveExamples(initialCheckBlueprint.positiveExamples);
            setHasInitialCheckBeenFetched(true);
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
            const checkBlueprint = await Api.getCheckBlueprint(checkId, user);
            if (!checkBlueprint) {
                console.warn(
                    `check blueprint not found for checkId=${checkId}`,
                );
                return;
            }
            setInitialCheckBlueprint(checkBlueprint);
        })();
    }, []);

    const saveCheck = useCallback(
        debounce(
            async (
                newName: string,
                newCheckType: CheckType,
                newInstruction: string,
                newDesc: string,
                newCategory: string,
                newPositiveExamples: PositiveCheckExample[],
            ) => {
                if (!user) {
                    return;
                }
                if (newCheckType === CheckType.highlight) {
                    // remove all of the editedText in the positive examples
                    newPositiveExamples = newPositiveExamples.map((example) => {
                        return {
                            originalText: example.originalText,
                            editedText: [],
                        };
                    });
                }

                const checkBlueprint: CheckBlueprint = {
                    objInfo: {
                        name: newName,
                        desc: newDesc,
                        id: checkId,
                        creatorId: user.uid,
                    },
                    checkType: newCheckType,
                    instruction: newInstruction,
                    category: newCategory,
                    positiveExamples: newPositiveExamples,
                };

                setSubmittingState(SubmittingState.Submitting);
                const success = await Api.editCheck(
                    checkBlueprint,
                    checkerId,
                    user,
                );
                if (success) {
                    setSubmittingState(SubmittingState.NotSubmitting);
                } else {
                    setSubmittingState(SubmittingState.ChangesDetected);
                }
            },
            1000,
        ),
        [],
    );

    useEffect(() => {
        // const checkerId =
        //     "1f981bc8190cc7be55aea57245e5a0aa255daea3e741ea9bb0153b23881b6161"; // use this if you want to test security rules
        if (!hasInitialCheckBeenFetched) {
            return;
        }
        saveCheck(
            name,
            checkType,
            instruction,
            desc,
            category,
            positiveExamples,
        );
    }, [name, checkType, instruction, desc, category, positiveExamples]);

    const handleDescKeyDown = (
        event: React.KeyboardEvent<HTMLTextAreaElement>,
    ) => {
        if (event.key === "Tab" && !event.shiftKey) {
            event.preventDefault(); // so we don't go to the next textbox
            // execCommand is deprecated but it works!
            document.execCommand("insertText", false, "  ");

            // I tried using setDesc but that would break the textarea's undo function
            // also stackoverflow + gpt isn't very useful. this was the most elegant solution for now
            // TODO: also support shift+tab
        }
    };

    return (
        <div className="flex flex-row mt-[50px] container mx-auto">
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
                <h1 className=" text-3xl font-bold mt-4">Create Check</h1>
                <label className="text-lg mt-4 font-bold">Name</label>
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={defaultName[checkType]}
                    maxLength={MAX_CHECK_NAME_LEN}
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
                    maxLength={MAX_CHECK_DESC_LEN}
                    onKeyDown={handleDescKeyDown}
                />
                <CheckSectionHeader
                    label="Model Instructions"
                    helpText="Here is where you tell the model how to edit the text."
                />
                <p className="text-sm mb-1 mt-1">
                    Want more help? Read our{" "}
                    <Link
                        href="/prompting-tips"
                        target="_blank"
                        className="mx-auto mt-4 border-b-2 border-blue-500 hover:text-blue-600"
                    >
                        prompting tips and example instructions
                    </Link>
                </p>
                <NormalTextArea
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
                    placeholder={defaultInstructions[checkType]}
                    minRows={4}
                    maxLength={MAX_CHECK_INSTR_LEN}
                />
                <CheckSectionHeader
                    label="Category (optional)"
                    helpText="If you want to organize your cards by category, you can add a category here."
                />
                <Input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder={defaultCategory[checkType]}
                    maxLength={MAX_CHECK_CATEGORY_LEN}
                />

                <div className="mt-4">
                    {positiveExamples.length > 0 && (
                        <>
                            <div className="font-bold text-lg">
                                Positive Examples
                            </div>
                            <div className="flex flex-col space-y-1 mt-2">
                                {positiveExamples.map((example, idx) => (
                                    <div
                                        className="flex flex-row items-start"
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
                                            setPositiveExamples={
                                                setPositiveExamples
                                            }
                                            positiveExamples={positiveExamples}
                                        />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
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

                <div className="mt-4 flex flex-row space-x-4 items-center">
                    <NormalButton
                        className="w-56 py-[4px]"
                        onClick={() => {
                            router.push(`/create/checker/${checkerId}`);
                        }}
                    >
                        Return to Create Checker
                    </NormalButton>
                    <NormalButton
                        className="py-[4px]"
                        onClick={() => {
                            router.push({
                                pathname: `/editor/${checkerId}`,
                                query: {
                                    onlyUseCheckId: checkId,
                                },
                            });
                        }}
                    >
                        Try your check in the editor
                    </NormalButton>
                    <div>{SaveStatusText[submittingState]}</div>
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
                <div className="fixed mx-auto w-[350px] left-[50%] right-0 mt-24">
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
export const CheckSectionHeader = ({
    label,
    helpText,
}: CheckSectionHeaderProps): JSX.Element => {
    return (
        <LabelWithHelp
            label={label}
            helpText={helpText}
            className="mt-2 font-bold text-lg"
            helpIconClassName="mt-[7px]"
        />
    );
};
