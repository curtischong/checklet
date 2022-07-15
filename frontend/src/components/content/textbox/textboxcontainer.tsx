import React, { useState, useRef } from "react";
import { Api } from "@api";
import { Button } from "antd";
import { Suggestion } from "../suggestions/suggestionsTypes";
import "react-quill/dist/quill.snow.css";
import { AccessCodeModal } from "./accessCodeModal";
import { mixpanelTrack } from "@utils";

export type TextboxContainerProps = {
    suggestions: Suggestion[];
    updateSuggestions: (s: Suggestion[]) => void;
};

const highlightColors = ["#CAE2F1", "#CCEAA5", "#DCBAE5", "#F5EBBB", "#DCBAB9"];

export const TextboxContainer: React.FC<TextboxContainerProps> = (
    props: TextboxContainerProps,
) => {
    const { updateSuggestions } = props;
    const [loading, setLoading] = useState(false);
    const [originalText, setOriginalText] = useState("replace me");
    const [isAccessCodeModalVisible, setIsAccessCodeModalVisible] =
        useState(false);

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
    const quillRef = useRef(Quill);

    const getButtonClasses = () => {
        let shared =
            "ml-auto mr-0 bg-transparent text-blue-700 h-[120px] py-1 border border-blue-500 rounded";
        if (loading) {
            shared += " disabled";
        } else {
            shared +=
                " hover:bg-blue-500 hover:text-white hover:border-transparent";
        }
        return shared;
    };

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
        setLoading(true);
        quillRef.current.editor.enable(false); // disable texting
        const text: string = quillRef.current
            .getEditor()
            .getText()
            .replace(/\n$/, "");
        try {
            const response = await Api.analyzeResume({ text });

            const feedback = response.feedback;
            let idx = 0;
            feedback.forEach((f) => {
                f.color = highlightColors[idx++ % 5];
                f.highlightRanges.forEach((range) => {
                    console.log(range);
                    quillRef.current
                        .getEditor()
                        .formatText(
                            range.startPos,
                            range.endPos - range.startPos,
                            { underline: `underline ${f.color}` },
                        );
                });
            });

            updateSuggestions(feedback);
            mixpanelTrack("Analyze Button Clicked", {
                "Number of suggestions generated": feedback.length,
                Suggestions: feedback,
                Input: text,
            });

            // DEPRECATED: group feedback by category
            // const categories = feedback.reduce((r: any, a: any) => {
            //     if (a.shortDesc in r) {
            //         r[a.shortDesc].suggestions.push(a);
            //     } else {
            //         r[a.shortDesc] = {};
            //         r[a.shortDesc].suggestions = [a];
            //         // quick hack for colour
            //         r[a.shortDesc].color = highlightColors[idx++ % 5];
            //     }

            //     return r;
            // }, Object.create(null));
        } finally {
            setLoading(false);
            quillRef.current.editor.enable(true);
        }
    };

    const showModal = () => {
        setIsAccessCodeModalVisible(true);
    };

    const onClose = () => {
        setIsAccessCodeModalVisible(false);
    };

    return (
        <div className="textbox col-span-3">
            <div className="flex pb-6">
                <div className="font-bold my-auto">Resume Feedback</div>
                <div
                    onClick={showModal}
                    className="italic text-blue-500 m-auto hover:underline"
                >
                    {" "}
                    Want an access code?{" "}
                </div>
                <AccessCodeModal
                    onClose={onClose}
                    visible={isAccessCodeModalVisible}
                />

                <Button
                    style={{ width: "117px", height: "36px" }}
                    className={getButtonClasses()}
                    onClick={analyzeText}
                    loading={loading}
                >
                    Analyze
                </Button>
            </div>
            <Quill
                style={{ minHeight: "400px" }}
                ref={quillRef}
                modules={{ toolbar: false }}
                theme="snow"
                value={originalText}
                onChange={setOriginalText}
                disabled={loading}
            />
        </div>
    );
};
