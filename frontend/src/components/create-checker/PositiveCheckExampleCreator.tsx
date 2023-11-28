import React from "react";

export interface PositiveCheckExample {
    originalText: string;
    editedText: string;
}

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
        <div className="flex flex-row">
            <label className="text-md">Original Text</label>
            <input
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                placeholder="January"
            />
            <label>Edited Text</label>
            <input
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                placeholder="Jan"
            />
            <button
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
            </button>
        </div>
    );
};
