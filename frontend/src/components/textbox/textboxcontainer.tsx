import React, { useState } from "react";
import { Textbox } from "./textbox";
export const TextboxContainer: React.FC = () => {
    const [originalText, setOriginalText] = useState("replace me");
    const [suggestedText, setSuggestedText] = useState("");
    const analyzeText = async () => {
        // TODO: Change to Axios
        // TODO: add an API class
        const response = await fetch("http://localhost:5000/resumes/feedback", {
            method: "POST",
            body: JSON.stringify({ text: originalText }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        setSuggestedText(data.text);
    };
    return (
        <div className="mx-auto max-w-screen-lg">
            <div className="grid grid-cols-2 gap-4 p-5">
                <Textbox
                    header="Original text"
                    text={originalText}
                    updateText={setOriginalText}
                />
                <Textbox
                    header="Suggested text"
                    text={suggestedText}
                    updateText={setSuggestedText}
                />
            </div>
            <button
                className="flex mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={analyzeText}
            >
                Analyze text
            </button>
        </div>
    );
};
