import React from "react";

export interface CheckExample {
    originalText: string;
    editedText: string;
}

interface Props {
    onCreate: (example: CheckExample) => void;
}

export const CheckExampleCreator = ({ onCreate }: Props): JSX.Element => {
    const [originalText, setOriginalText] = React.useState("");
    const [editedText, setEditedText] = React.useState("");
    return (
        <div className="flex flex-col">
            <h1>Create Example</h1>
            <div className="flex flex-row">
                <label>Original Text</label>
                <input
                    value={originalText}
                    onChange={(e) => setOriginalText(e.target.value)}
                />
                <label>Edited Text</label>
                <input
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                />
                <button
                    onClick={() => {
                        onCreate({
                            originalText,
                            editedText,
                        });
                    }}
                >
                    Create
                </button>
            </div>
        </div>
    );
};
