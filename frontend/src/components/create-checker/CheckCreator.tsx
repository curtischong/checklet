import { DeleteButton, NormalButton } from "@components/Button";
import { Input } from "@components/Input";
import { LabelWithHelp } from "@components/LabelWithHelp";
import { SlidingRadioButton } from "@components/SlidingRadioButton";
import { TextArea } from "@components/TextArea";
import { CheckPreview } from "@components/create-checker/CheckPreview";
import { Page } from "@components/create-checker/CheckerCreator";
import {
    CheckBlueprint,
    CheckType,
    PositiveCheckExample,
} from "@components/create-checker/CheckerTypes";
import { PositiveCheckExampleCreator } from "@components/create-checker/PositiveCheckExampleCreator";
import { RightArrowIcon } from "@components/icons/RightArrowIcon";
import { RightArrowWithTailIcon } from "@components/icons/RightArrowWithTailIcon";
import { createUniqueId } from "@utils/strings";
import { SetState } from "@utils/types";
import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";

interface Props {
    onCreate: (check: CheckBlueprint) => void;
    setPage: (page: Page, pageData?: unknown) => void;
    pageData?: unknown;
}
export const CheckCreator = ({
    onCreate,
    setPage,
    pageData,
}: Props): JSX.Element => {
    const [name, setName] = React.useState("");
    const [longDesc, setLongDesc] = React.useState("");
    const [instruction, setInstruction] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [positiveExamples, setPositiveExamples] = React.useState<
        PositiveCheckExample[]
    >([]);
    const [checkId, setCheckId] = React.useState<string>(createUniqueId());
    const [checkType, setCheckType] = React.useState<CheckType>(
        CheckType.highlight,
    );

    useEffect(() => {
        const rawInitialCheckBlueprint = (pageData as any)
            ?.initialCheckBlueprint;
        if (rawInitialCheckBlueprint) {
            const initialCheckBlueprint =
                rawInitialCheckBlueprint as CheckBlueprint;
            setName(initialCheckBlueprint.name);
            setLongDesc(initialCheckBlueprint.longDesc);
            setInstruction(initialCheckBlueprint.instruction);
            setCategory(initialCheckBlueprint.category);
            setPositiveExamples(initialCheckBlueprint.positiveExamples);
            setCheckId(initialCheckBlueprint.checkId);
        }
    }, []);

    const [clickedSubmit, setClickedSubmit] = React.useState(false);
    const [err, setErr] = React.useState("");
    const router = useRouter();

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

    // TODO: we should have a demo card that appears as you fill in the fields (it'll be on the right side)
    return (
        <div className="flex flex-row mt-4 ">
            <div
                className="flex flex-col flex-grow"
                style={{
                    flexBasis: "0",
                }}
            >
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

                <h1 className=" text-xl font-bold">Create Check</h1>
                <label className="text-md mt-4">Name</label>
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Shorten Month"
                />
                <label className="text-md mt-4">Check Type</label>
                <SlidingRadioButton
                    options={[
                        CheckType.highlight,
                        CheckType.rephrase,
                        CheckType.rephraseMultiple,
                        CheckType.proposal,
                    ]}
                    selected={checkType}
                    setSelected={setCheckType as SetState<string>}
                />

                <LabelWithHelp
                    label="Model Instructions"
                    helpText="Here is where you tell the model how to edit the text."
                />
                <TextArea
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
                    placeholder={`If you see the name of the month, shorten it to only three characters. Do not end these shortened months with a period.`}
                />
                <LabelWithHelp
                    label="Suggestion Reason"
                    helpText="This is a great place to explain your suggestion. Users will see this when they expand the card."
                />
                <TextArea
                    value={longDesc}
                    onChange={(e) => setLongDesc(e.target.value)}
                    placeholder={`Shorter months create more whitespace.`}
                />
                <LabelWithHelp
                    label="Category (optional)"
                    helpText="If you want to organize your cards by category, you can add a category here."
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
                                <RightArrowWithTailIcon className="mx-4" />
                                <div className="flex flex-col">
                                    <div>{example.editedText}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <PositiveCheckExampleCreator
                        onCreate={(newExample) => {
                            setPositiveExamples([
                                ...positiveExamples,
                                newExample,
                            ]);
                        }}
                    />
                </div>

                <div className="text-[#ff0000] mt-4 ">{err}</div>

                <div className="mt-4 mb-20">
                    <NormalButton
                        onClick={() => {
                            setClickedSubmit(true);
                            if (getIncompleteFormErr() !== "") {
                                return;
                            }

                            const checkBlueprint: CheckBlueprint = {
                                name,
                                instruction,
                                longDesc,
                                category,
                                positiveExamples,
                                checkId,
                            };
                            onCreate(checkBlueprint);
                        }}
                    >
                        Create Check
                    </NormalButton>
                </div>
            </div>
            <CheckPreview
                checkBlueprint={{
                    name,
                    instruction,
                    longDesc,
                    category,
                    positiveExamples,
                    checkId,
                }}
            />
        </div>
    );
};
