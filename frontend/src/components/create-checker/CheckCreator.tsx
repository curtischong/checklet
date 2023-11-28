import { Button, NormalButton, SubmitButton } from "@components/Button";
import { Input } from "@components/Input";
import { TextArea } from "@components/TextArea";
import { Check } from "@components/create-checker/Check";
import {
    PositiveCheckExample,
    PositiveCheckExampleCreator,
} from "@components/create-checker/PositiveCheckExampleCreator";
import { HelpIcon } from "@components/icons/HelpIcon";
import { Tooltip } from "antd";
import React, { useEffect } from "react";

interface Props {
    onCreate: (check: Check) => void;
}
export const CheckCreator = ({ onCreate }: Props): JSX.Element => {
    const [name, setName] = React.useState("");
    const [longDesc, setLongDesc] = React.useState("");
    const [instruction, setInstruction] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [positiveExamples, setPositiveExamples] = React.useState<
        PositiveCheckExample[]
    >([]);
    const [err, setErr] = React.useState("");
    useEffect(() => {
        if (name === "") {
            setErr("Please enter a short description");
        }
    }, []);

    // TODO: we should have a demo card that appears as you fill in the fields (it'll be on the right side)
    return (
        <div className="flex flex-row">
            <div className="flex flex-col">
                <h1 className="mt-4 text-xl font-bold">Create Check</h1>
                <label className="text-md mt-4">Name</label>
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Shorten Month"
                />
                <div className="flex flex-row mt-2">
                    <label>Model Instructions</label>
                    <HelpIcon
                        className="mt-1 ml-1"
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
                        className="mt-1 ml-1"
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
                        className="mt-1 ml-1"
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
                            className="mt-1 ml-1"
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
                                <div className="flex flex-col">
                                    <div className="text-md font-bold">
                                        Original Text
                                    </div>
                                    <div>{example.originalText}</div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="text-md font-bold">
                                        Edited Text
                                    </div>
                                    <div>{example.editedText}</div>
                                </div>
                                <button
                                    onClick={() => {
                                        setPositiveExamples(
                                            positiveExamples.filter(
                                                (_, i) => i !== idx,
                                            ),
                                        );
                                    }}
                                >
                                    Delete
                                </button>
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

                <div className="text-[#ff0000] bg-white px-2 mt-4 ">{err}</div>

                <div className="mt-4">
                    <NormalButton
                        onClick={() => {
                            // onCreate({
                            //     name,
                            // })
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
