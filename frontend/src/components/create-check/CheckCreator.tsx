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
import { CreateCheckNavigationPath } from "@components/create-check/CreateCheckNavigationPath";
import { Page } from "@components/create-checker/CheckerCreator";
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
} from "@components/create-check/DefaultTextForCheckType";
import { PositiveCheckExampleCreator } from "@components/create-check/PositiveCheckExampleCreator";
import { HelpIcon } from "@components/icons/HelpIcon";
import { useClientContext } from "@utils/ClientContext";
import { createUniqueId } from "@utils/strings";
import { SetState } from "@utils/types";
import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";
import { toast } from "react-toastify";

{
    /* <CheckCreator
    submittingState={submittingState}
    onCreate={(check) => {
        const existingCheckIdx = checkBlueprints.findIndex(
            (c) => c.checkId === check.checkId,
        );
        const newCheckBlueprints = [...checkBlueprints];
        if (existingCheckIdx !== -1) {
            // this check already exists. So we find its index, and replace it
            newCheckBlueprints[existingCheckIdx] = check;
        } else {
            newCheckBlueprints.push(check);
        }
        setCheckBlueprints(newCheckBlueprints);
        if (!user) {
            toast.error("You must be logged in to create/update a check");
            setSubmittingState(SubmittingState.NotSubmitting);
            return;
        }
        const checker = {
            name,
            desc,
            checkBlueprints: newCheckBlueprints,
            creatorId: user.uid,
        } as CheckerBlueprint;

        // const checkerId =
        //     "1f981bc8190cc7be55aea57245e5a0aa255daea3e741ea9bb0153b23881b6161"; // use this if you want to test security rules
        setSubmittingState(SubmittingState.Submitting);
        (async () => {
            await Api.createChecker(
                checker,
                checkerId,
                await user.getIdToken(),
            );
            setSubmittingState(SubmittingState.Submitted);
            setTimeout(() => {
                setSubmittingState(SubmittingState.NotSubmitting);
            }, 3000);
        })();
    }}
    setPage={setPage}
    pageData={pageData}
/>; */
}

interface Props {
    checkId: CheckId;
}
export const CheckCreator = ({ checkId }: Props): JSX.Element => {
    const [name, setName] = React.useState<string | undefined>(undefined);
    const [desc, setDesc] = React.useState("");
    const [instruction, setInstruction] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [positiveExamples, setPositiveExamples] = React.useState<
        PositiveCheckExample[]
    >([]);
    const [checkType, setCheckType] = React.useState<CheckType | undefined>(
        undefined,
    );
    const [originalText, setOriginalText] = React.useState("");
    const [editedText, setEditedText] = React.useState("");

    // the pageData is just an optimization we do so we don't need to fetch it from the server
    // if the previous page already had information about the check
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawInitialCheckBlueprint = (pageData as any)?.initialCheckBlueprint;
    const router = useRouter();
    const { user } = useClientContext();

    const setInitialCheckBlueprint = useCallback(
        (initialCheckBlueprint: CheckBlueprint) => {
            setName(initialCheckBlueprint.name);
            setDesc(initialCheckBlueprint.desc);
            setCheckType(initialCheckBlueprint.checkType);
            setInstruction(initialCheckBlueprint.instruction);
            setCategory(initialCheckBlueprint.category);
            setPositiveExamples(initialCheckBlueprint.positiveExamples);
            setCheckId(initialCheckBlueprint.checkId);
        },
        [],
    );
    useEffect(() => {
        const routerCheckerId = router.query.checkerId as string;
        const routerCheckId = router.query.checkId as string;
        if (rawInitialCheckBlueprint) {
            setInitialCheckBlueprint(rawInitialCheckBlueprint);
        } else if (routerCheckerId && routerCheckId) {
            (async () => {
                if (!user) {
                    toast.error("Please log in to edit your check");
                    return;
                }
                // not needed. we just pas in the checkerId in the url
                // const checkerBlueprint = await Api.fetchCheckerBlueprint(
                //     routerCheckerId as string,
                //     user,
                // );
                if (!checkerBlueprint) {
                    console.warn(
                        `checker blueprint not found for checkerId=${routerCheckerId}`,
                    );
                    return;
                }
                for (const checkBlueprint of checkerBlueprint.checkBlueprints) {
                    if (checkBlueprint.checkId === routerCheckId) {
                        setInitialCheckBlueprint(checkBlueprint);
                        return;
                    }
                }
                console.warn(
                    `check blueprint with id=${routerCheckId} not found in checker blueprint with id=${routerCheckerId}`,
                );
            })();
        }
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

    const createCheck = useCallback(() => {
        setClickedSubmit(true);
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
            name,
            checkType,
            instruction,
            desc,
            category,
            positiveExamples: newPositiveExamples,
            checkId,
        };
        onCreate(checkBlueprint);
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

    if (name === undefined) {
        return <CreateCheckName setCheckName={setName} setPage={setPage} />;
    }

    if (checkType === undefined) {
        return (
            <SelectCheckType setCheckType={setCheckType} setPage={setPage} />
        );
    }

    const SubmitCheckText = {
        [`${SubmittingState.NotSubmitting}-create`]: "Create Check",
        [`${SubmittingState.Submitting}-create`]: "Creating Check",
        [`${SubmittingState.Submitted}-create`]: "Check Created!",
        [`${SubmittingState.NotSubmitting}-update`]: "Update Check",
        [`${SubmittingState.Submitting}-update`]: "Updating Check",
        [`${SubmittingState.Submitted}-update`]: "Check Updated!",
    };

    return (
        <div className="flex flex-row mt-4 ">
            <div
                className="flex flex-col flex-grow"
                style={{
                    flexBasis: "0",
                }}
            >
                <CreateCheckNavigationPath setPage={setPage} />
                <h1 className=" text-xl font-bold">Create Check</h1>
                <label className="text-md mt-4">Name</label>
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={defaultName[checkType]}
                />

                <LabelWithHelp
                    label="Suggestion Reason"
                    helpText="This is a great place to explain your suggestion. Users will see this when they expand the card."
                    className="mt-2"
                />
                <NormalTextArea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder={defaultDesc[checkType]}
                    minRows={3}
                />
                <LabelWithHelp
                    label="Model Instructions"
                    helpText="Here is where you tell the model how to edit the text."
                    className="mt-2"
                />
                <NormalTextArea
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
                    placeholder={defaultInstructions[checkType]}
                    minRows={4}
                />
                <LabelWithHelp
                    label="Category (optional)"
                    helpText="If you want to organize your cards by category, you can add a category here."
                    className="mt-2"
                />
                <Input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder={defaultCategory[checkType]}
                />

                <div className="mt-4">
                    <LabelWithHelp
                        label="Positive Examples"
                        helpText="Positive examples helps the model recognize when to apply your check. Because just like humans, computers understand instructions better with examples"
                        className="mt-2"
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
                                <PositiveExamplePreview
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
                        onClick={createCheck}
                        className="w-40"
                    >
                        {
                            SubmitCheckText[
                                `${submittingState}-${
                                    rawInitialCheckBlueprint
                                        ? "update"
                                        : "create"
                                }`
                            ]
                        }
                    </LoadingButtonSubmit>
                    <NormalButton
                        className="w-56 py-[4px]"
                        onClick={() => {
                            setPage(Page.Main);
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
                            className="ml-2 mt-[6px]"
                            text={feedbackTypeDesc(checkType)}
                        />
                    </div>
                    <CheckPreview
                        blueprint={{
                            checkType,
                            name,
                            instruction,
                            desc,
                            category,
                            positiveExamples,
                            checkId,
                        }}
                        originalText={originalText}
                        editedText={editedText}
                    />
                </div>
            </div>
        </div>
    );
};
