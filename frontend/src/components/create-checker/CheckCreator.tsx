import { Check } from "@api/check";
import { DeleteButton, NormalButton } from "@components/Button";
import { Input } from "@components/Input";
import { TextArea } from "@components/TextArea";
import { CheckBlueprint } from "@components/create-checker/Check";
import { Page } from "@components/create-checker/CheckerCreator";
import {
    PositiveCheckExample,
    PositiveCheckExampleCreator,
} from "@components/create-checker/PositiveCheckExampleCreator";
import { HelpIcon } from "@components/icons/HelpIcon";
import { RightArrowIcon } from "@components/icons/RightArrowIcon";
import {
    RightArrowIwthTailIcon,
    RightArrowWithTailIcon,
} from "@components/icons/RightArrowWithTailIcon";
import { SetState } from "@utils/types";
import React, { useCallback, useEffect } from "react";

interface Props {
    onCreate: (check: CheckBlueprint) => void;
    setPage: (page: Page) => void;
}
export const CheckCreator = ({ onCreate, setPage }: Props): JSX.Element => {
    const [name, setName] = React.useState("");
    const [longDesc, setLongDesc] = React.useState("");
    const [instruction, setInstruction] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [positiveExamples, setPositiveExamples] = React.useState<
        PositiveCheckExample[]
    >([]);

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

    // TODO: we should have a demo card that appears as you fill in the fields (it'll be on the right side)
    return (
        <div className="flex flex-row mt-4">
            <div className="flex flex-col">
                <div className="flex flex-row items-center">
                    <p
                        className="text-gray-800 cursor-pointer"
                        onClick={() => {
                            setPage(Page.Main);
                        }}
                    >
                        Create checker
                    </p>
                    <RightArrowIcon className="mx-2 w-[14px]" />
                    <p className="font-bold">Create check</p>
                </div>

                <h1 className=" text-xl font-bold">Create Check</h1>
                <label className="text-md mt-4">Name</label>
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Shorten Month"
                />
                <div className="flex flex-row mt-2">
                    <label>Model Instructions</label>
                    <HelpIcon
                        className="mt-[3px] ml-1"
                        text={
                            "Here is where you tell the model how to edit the text."
                        }
                    />
                </div>
                <TextArea
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
                    placeholder={`In this text, if you see the name of the month, shorten it to only three characters. Do not end these shortened months with a period. Do not repeat back the entire text. Only output the edited text plus a bit of context around the edit for context.`}
                />
                <div className="flex flex-row mt-2">
                    <label>Long Description</label>
                    <HelpIcon
                        className="mt-[3px] ml-1"
                        text={
                            "This is a great place to explain your suggestion. Users will see this when they expand the card."
                        }
                    />
                </div>
                <TextArea
                    value={longDesc}
                    onChange={(e) => setLongDesc(e.target.value)}
                    placeholder={`Shorter months create more whitespace.`}
                />
                <div className="flex flex-row mt-2">
                    <label>Category (optional)</label>
                    <HelpIcon
                        className="mt-[3px] ml-1"
                        text={
                            "If you want to organize your cards by category, you can add a category here."
                        }
                    />
                </div>
                <Input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder={`Whitespace`}
                />

                <div className="mt-4">
                    <div className="flex flex-row mt-2">
                        <label>Positive Examples</label>
                        <HelpIcon
                            className="mt-[3px] ml-1"
                            text={
                                "Positive examples help the model understand when to apply your check"
                            }
                        />
                    </div>
                    <div className="flex flex-col">
                        {positiveExamples.map((example, idx) => (
                            <div
                                className="flex flex-row"
                                id={`positive-example-${idx}`}
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

                <div className="mt-4">
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
                            };
                            onCreate(checkBlueprint);
                        }}
                    >
                        Create Check
                    </NormalButton>
                </div>
            </div>
            <div>
                <h1>todo: preview card</h1>
            </div>
        </div>
    );
};
