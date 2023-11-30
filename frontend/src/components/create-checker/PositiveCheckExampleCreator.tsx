import { TextButton } from "@components/Button";
import { SmallInput } from "@components/Input";
import { PositiveCheckExample } from "@components/create-checker/CheckerTypes";
import React from "react";

interface Props {
    onCreate: (example: PositiveCheckExample) => void;
}

// TODO: add negative check example creator
export const PositiveCheckExampleCreator = ({
    onCreate,
}: Props): JSX.Element => {
    const [originalText, setOriginalText] = React.useState("");
    const [editedText, setEditedText] = React.useState("");
    return (
        <div className="flex flex-row space-x-2">
            <div className="flex items-center">
                <label className="text-md">Original Text</label>
            </div>
            <SmallInput
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                placeholder="January"
                className="py-[2px] px-2"
            />
            <div className="flex items-center">
                <label>Edited Text</label>
            </div>
            <SmallInput
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                placeholder="Jan"
            />
            <TextButton
                disabled={originalText === "" || editedText === ""}
                onClick={() => {
                    onCreate({
                        originalText,
                        editedText,
                    });
                    setOriginalText("");
                    setEditedText("");
                }}
            >
                Create
            </TextButton>
        </div>
    );
};
