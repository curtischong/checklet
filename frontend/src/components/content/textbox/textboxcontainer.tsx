import React, { useState, useRef } from "react";
import { Api } from "../../../api/Api";
import { SuggestionCategory } from "../suggestions/suggestionsTypes";
import "react-quill/dist/quill.snow.css";

export type TextboxContainerProps = {
    suggestions: SuggestionCategory[];
    updateSuggestions: (s: SuggestionCategory[]) => void;
};

const highlightColors = ["#CAE2F1", "#CCEAA5", "#DCBAE5", "#F5EBBB", "#DCBAB9"];

export const TextboxContainer: React.FC<TextboxContainerProps> = (
    props: TextboxContainerProps,
) => {
    const { suggestions, updateSuggestions } = props;
    const [originalText, setOriginalText] = useState("replace me");
    const quillRef = useRef(null);

    // issue with rendering when document not yet defined
    const quill = () => {
        if (document) {
            return require("react-quill");
        }
        return null;
    };
    if (!quill()) {
        console.log("not null");
        return null;
    }
    const Quill = quill();

    const mergeIntervals = (intervals: number[][]) => {
        if (intervals.length < 2) return intervals;

        intervals.sort((a, b) => a[0] - b[0]);

        const result = [];
        let previous = intervals[0];

        for (let i = 1; i < intervals.length; i += 1) {
            if (previous[1] >= intervals[i][0]) {
                previous = [
                    previous[0],
                    Math.max(previous[1], intervals[i][1]),
                ];
            } else {
                result.push(previous);
                previous = intervals[i];
            }
        }

        result.push(previous);

        return result;
    };

    const analyzeText = async () => {
        if (quillRef === null || quillRef.current === null) {
            return;
        }
        const currQuill: any = quillRef.current;
        const text = currQuill.getEditor().getText();
        const response = await Api.analyzeResume({ text });

        const feedback = response.feedback;

        let idx = 0;
        // group feedback by category
        const categories = feedback.reduce((r: any, a: any) => {
            if (a.shortDesc in r) {
                r[a.shortDesc].suggestions.push(a);
            } else {
                r[a.shortDesc] = {};
                r[a.shortDesc].suggestions = [a];
                // quick hack for colour
                r[a.shortDesc].color = highlightColors[idx++ % 5];
            }

            return r;
        }, Object.create(null));

        Object.keys(categories).forEach((key: any) => {
            categories[key].suggestions.forEach((sugg: any) => {
                currQuill
                    .getEditor()
                    .formatText(
                        sugg.srcWord.startChar,
                        sugg.srcWord.endChar - sugg.srcWord.startChar,
                        { "background-color": categories[key].color },
                    );
            });
        });

        updateSuggestions(Object.values(categories));
    };
    return (
        <div className="textbox col-span-3">
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
            <Quill
                style={{ minHeight: "400px" }}
                ref={quillRef}
                modules={{ toolbar: false }}
                theme="snow"
                value={originalText}
                onChange={setOriginalText}
            />
        </div>
    );
};
