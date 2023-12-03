import { TextButton } from "@components/Button";
import { SmallInput } from "@components/Input";
import { TextArea } from "@components/TextArea";
import ThinLine from "@components/ThinLine";
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
        <div className="flex flex-col ">
            <ThinLine className="mt-4" />
            <div className="flex items-center ">
                <label className="text-md">Original Text</label>
            </div>
            <TextArea
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                placeholder="January"
                minHeight={10}
            />
            <div className="flex items-center">
                <label>Edited Text</label>
            </div>
            <TextArea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                placeholder="Jan"
                minHeight={40}
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
