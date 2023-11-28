import { Button } from "@components/button";
import { Check } from "@components/create-checker/Check";
import {
    PositiveCheckExample,
    PositiveCheckExampleCreator,
} from "@components/create-checker/PositiveCheckExampleCreator";
import React from "react";

interface Props {
    onCreate: (check: Check) => void;
}
export const CheckCreator = ({ onCreate }: Props): JSX.Element => {
    const [name, setName] = React.useState("");
    const [shortDesc, setShortDesc] = React.useState("");
    const [longDesc, setLongDesc] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [positiveExamples, setPositiveExamples] = React.useState<
        PositiveCheckExample[]
    >([]);

    // TODO: we should have a demo card that appears as you fill in the fields (it'll be on the right side)
    return (
        <div className="flex flex-row">
            <div className="flex flex-col">
                <h1 className="mt-4 text-xl font-bold">Create Check</h1>
                <label>Name</label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Shorten Month"
                />
                <label>Short Description Prompt</label>
                <input
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}
                    placeholder={`say: Shorten Month`}
                />

                {/* TODO: add a tooltip saying: "a great place to explain why this card is useful" */}
                <label>Long Description Prompt</label>
                <input
                    value={longDesc}
                    onChange={(e) => setLongDesc(e.target.value)}
                    placeholder={`say: Shorter months create more whitespace.`}
                />
                <label>Category (optional)</label>
                <input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder={`Whitespace`}
                />

                <div>
                    <div className="text-md font-bold">Positive Examples</div>
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

                <Button
                    onClick={() => {
                        // onCreate({
                        //     name,
                        // })
                    }}
                >
                    Submit
                </Button>
            </div>
            <div>
                <h1>todo: preview card</h1>
            </div>
        </div>
    );
};
