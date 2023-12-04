import { Api } from "@api/apis";
import {
    DeleteButton,
    LoadingButtonSubmit,
    NormalButton,
    SubmitButton,
    SubmittingState,
} from "@components/Button";
import { Input } from "@components/Input";
import { LabelWithHelp } from "@components/LabelWithHelp";
import { SlidingRadioButton } from "@components/SlidingRadioButton";
import { NormalTextArea } from "@components/TextArea";
import { CheckPreview } from "@components/create-checker/CheckPreview";
import { Page } from "@components/create-checker/CheckerCreator";
import {
    CheckBlueprint,
    CheckType,
    PositiveCheckExample,
    validCheckTypes,
} from "@components/create-checker/CheckerTypes";
import { PositiveCheckExampleCreator } from "@components/create-checker/PositiveCheckExampleCreator";
import { HelpIcon } from "@components/icons/HelpIcon";
import { RightArrowIcon } from "@components/icons/RightArrowIcon";
import { RightArrowWithTailIcon } from "@components/icons/RightArrowWithTailIcon";
import { useClientContext } from "@utils/ClientContext";
import { createUniqueId } from "@utils/strings";
import { SetState } from "@utils/types";
import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";
import { toast } from "react-toastify";

interface Props {
    onCreate: (check: CheckBlueprint) => void;
    setPage: (page: Page, pageData?: unknown) => void;
    pageData?: unknown;
    submittingState: SubmittingState;
}
export const CheckCreator = ({
    onCreate,
    setPage,
    pageData,
    submittingState,
}: Props): JSX.Element => {
    const [name, setName] = React.useState<string | undefined>(undefined);
    const [longDesc, setLongDesc] = React.useState("");
    const [instruction, setInstruction] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [positiveExamples, setPositiveExamples] = React.useState<
        PositiveCheckExample[]
    >([]);
    const [checkId, setCheckId] = React.useState<string>(createUniqueId());
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
            setLongDesc(initialCheckBlueprint.longDesc);
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
                const checkerBlueprint = await Api.fetchCheckerBlueprint(
                    await user.getIdToken(),
                    routerCheckerId as string,
                );
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
        } else if (longDesc === "") {
            return "Please enter a long description";
        } else if (positiveExamples.length === 0) {
            return "Please enter at least one positive example";
        } else {
            return "";
        }
    }, [name, instruction, longDesc, positiveExamples]);

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
            longDesc,
            category,
            positiveExamples: newPositiveExamples,
            checkId,
        };
        onCreate(checkBlueprint);
    }, [
        name,
        checkType,
        instruction,
        longDesc,
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
                <CreateCheckerNavigationPath setPage={setPage} />
                <h1 className=" text-xl font-bold">Create Check</h1>
                <label className="text-md mt-4">Name</label>
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Shorten Month"
                />

                <LabelWithHelp
                    label="Suggestion Reason"
                    helpText="This is a great place to explain your suggestion. Users will see this when they expand the card."
                    className="mt-2"
                />
                <NormalTextArea
                    value={longDesc}
                    onChange={(e) => setLongDesc(e.target.value)}
                    placeholder={`Shorter months create more whitespace.`}
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
                    placeholder={`If you see the name of the month, shorten it to only three characters. Do not end these shortened months with a period.`}
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
                    placeholder={`Whitespace`}
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
                                <div className="flex flex-col">
                                    <div>{example.originalText}</div>
                                </div>
                                {checkType === CheckType.rephrase && (
                                    <>
                                        <RightArrowWithTailIcon className="mx-4" />
                                        <div className="flex flex-col">
                                            <div>{example.editedText}</div>
                                        </div>
                                    </>
                                )}
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
                <div className="fixed mx-auto w-[30vw] left-[50%] right-0 mt-10">
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
                        checkBlueprint={{
                            checkType,
                            name,
                            instruction,
                            longDesc,
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

interface CreateCheckerNavigationPathProps {
    setPage: (page: Page, pageData?: unknown) => void;
}

const CreateCheckerNavigationPath = ({
    setPage,
}: CreateCheckerNavigationPathProps): JSX.Element => {
    const router = useRouter();
    return (
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
            <p
                className="text-gray-400 cursor-pointer  transition duration-300 hover:text-gray-600"
                onClick={() => {
                    setPage(Page.Main);
                }}
            >
                Create checker
            </p>
            <RightArrowIcon className="mx-2 w-[14px]" />
            <p className="font-bold text-gray-600">Create check</p>
        </div>
    );
};

interface CreateCheckNameProps {
    setCheckName: SetState<string | undefined>;
    setPage: (page: Page, pageData?: unknown) => void;
}

const CreateCheckName = ({ setCheckName, setPage }: CreateCheckNameProps) => {
    const [tmpName, setTmpName] = React.useState("");
    return (
        <div>
            <CreateCheckerNavigationPath setPage={setPage} />
            <div className="w-[500px] mx-auto flex flex-col justify-center h-[80vh]">
                <div className="text-xl font-bold">Define your Check</div>
                <div className="mt-4 text-xl">Check Name</div>
                <div>
                    Great names are simple, succinct, and describe what you are
                    checking
                </div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (tmpName !== "") {
                            setCheckName(tmpName);
                        }
                    }}
                >
                    <Input
                        placeholder="Shorten Months"
                        value={tmpName}
                        onChange={(e) => setTmpName(e.target.value)}
                        className="mt-4"
                    />
                </form>
                <SubmitButton
                    onClick={() => setCheckName(tmpName)}
                    className="mt-4 w-40"
                    disabled={tmpName === ""}
                >
                    Continue
                </SubmitButton>
            </div>
        </div>
    );
};

const feedbackTypeDesc = (checkType: CheckType) => {
    switch (checkType) {
        case CheckType.highlight:
            return (
                <div>
                    <div>
                        Highlight checks are used to highlight a section of
                        text. They're useful for pointing out flaws, but don't
                        offer a specific suggestion to fix it.
                    </div>
                    <br />
                    <div>
                        This is useful if you know there's an error, but don't
                        have enough information to suggest a fix.
                    </div>
                </div>
            );
        case CheckType.rephrase:
            return (
                <div>
                    <div>
                        Rephrase checks suggest alternative ways to change the
                        text.
                    </div>
                    <br />
                    <div>
                        This is useful if you know alternative rephrasings of
                        the text. This card is also useful if you want to delete
                        text.
                    </div>
                </div>
            );
        case CheckType.proposal:
            // return (<div><div>Proposal feedbacks allows the model to propose information to the user. They aren't rephrase feedbacks because the proposals presented don't change the text. </div></br><div>This is useful for complex suggestions that can't be easily expressed as a rephrase.</div><div>);
            return (
                <div>
                    <div>
                        Proposal feedbacks allows the model to propose
                        information to the user. They aren't rephrase feedbacks
                        because the proposals presented don't change the text.
                    </div>
                    <br />
                    <div>
                        This is useful for complex suggestions that can't be
                        easily expressed as a rephrase.
                    </div>
                </div>
            );
        default:
            throw new Error("unknown feedback type");
    }
};

interface SelectCheckTypeProps {
    setCheckType: SetState<CheckType | undefined>;
    setPage: (page: Page, pageData?: unknown) => void;
}

const SelectCheckType = ({
    setCheckType,
    setPage,
}: SelectCheckTypeProps): JSX.Element => {
    const [tmpCheckType, setTmpCheckType] = React.useState<CheckType>(
        CheckType.highlight,
    );

    return (
        <div className="flex flex-col">
            <CreateCheckerNavigationPath setPage={setPage} />
            <div className="w-[50vw] mx-auto flex flex-col">
                <div className="mt-16 font-bold text-xl">Select Check Type</div>
                <SlidingRadioButton
                    options={validCheckTypes}
                    selected={tmpCheckType}
                    setSelected={setTmpCheckType as SetState<string>}
                    className="mt-10 mx-auto "
                />
                <div className="w-[400px] mx-auto mt-8 h-48">
                    <CheckPreview
                        checkBlueprint={{
                            name: "",
                            longDesc: "",
                            instruction: "",
                            category: "",
                            checkId: "",
                            checkType: tmpCheckType,
                            positiveExamples: [],
                        }}
                        originalText=""
                        editedText=""
                    />
                </div>
                <div className="flex flex-col mb-10 ml-1">
                    <div className=" flex flex-row">
                        <div className="font-bold text-lg">
                            {tmpCheckType} Check
                        </div>
                    </div>
                    <div className="mt-2">{feedbackTypeDesc(tmpCheckType)}</div>
                </div>
                <SubmitButton
                    onClick={() => setCheckType(tmpCheckType)}
                    className="w-[300px] mx-auto"
                >
                    Create {tmpCheckType} Check
                </SubmitButton>
            </div>
        </div>
    );
};
