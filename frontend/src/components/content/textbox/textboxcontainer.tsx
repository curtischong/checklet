import React, { useState } from "react";
import { Textbox } from "./textbox";
import { Api } from "../../../api/Api";

export const TextboxContainer: React.FC = () => {
    const [originalText, setOriginalText] = useState("replace me");
    const [_, setSuggestedText] = useState("");
    const analyzeText = async () => {
        // TODO: Change to Axios
        // TODO: add an API class
        // const response = await fetch("http://localhost:5000/resumes/feedback", {
        //     method: "POST",
        //     body: JSON.stringify({ text: originalText }),
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        // });
        // const data = await response.json();
        const data = await Api.analyzeResume({ text: originalText });
        console.log(data);
        setSuggestedText(data.text);
    };
    return (
        <div className="col-span-3">
            <div className="flex pb-6">
                <div className="font-bold my-auto">
                    Paste Your Resume Points
                </div>
                <button
                    className="ml-auto mr-0 bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white py-1 px-8 border border-blue-500 hover:border-transparent rounded"
                    onClick={analyzeText}
                >
                    Analyze
                </button>
            </div>
            <Textbox text={originalText} updateText={setOriginalText} />
        </div>
    );
};
