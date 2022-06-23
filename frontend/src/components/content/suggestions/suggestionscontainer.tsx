import { Divider } from "antd";
import React from "react";

import { SuggestionMetric } from "./suggestionmetric";
import { LengthMetric, SuggestionCategory } from "./suggestionsTypes";
import css from "./suggestions.module.scss";
import { SuggestionCard } from "./suggestioncard";

const metrics: LengthMetric[] = [
    {
        name: "Reading time",
        value: 92,
        isTime: true,
    },
    {
        name: "Letters",
        value: 701,
    },
    {
        name: "Characters",
        value: 87,
    },
    {
        name: "Words",
        value: 159,
    },
    {
        name: "Sentences",
        value: 12,
    },
    {
        name: "Paragraphs",
        value: 8,
    },
];

const suggestions: SuggestionCategory[] = [
    {
        categoryName: "Brevity",
        color: "#CAE2F1",
        suggestions: [
            {
                suggestionText: "bullet points should be shorter",
            },
            {
                suggestionText: "you should have less bullet points",
            },
        ],
    },
    {
        categoryName: "Another category",
        color: "#DCBAE5",
        suggestions: [{ suggestionText: "hi" }],
    },
    {
        categoryName: "hehehefhsoifhsof",
        color: "#CCEAA5",
        suggestions: [
            { suggestionText: "dfiojgdfg" },
            { suggestionText: "soifiosjfi" },
        ],
    },
];

export const SuggestionsContainer: React.FC = () => {
    return (
        <div className="col-span-2">
            <div className="font-bold pb-4 pt-1">Suggestions</div>
            <div className="px-4">
                {metrics.map((metric, index) => (
                    <SuggestionMetric {...metric} key={index} />
                ))}
                <Divider className={css.divider} />

                {suggestions.map((suggestion, index) => (
                    <SuggestionCard {...suggestion} key={index} />
                ))}
            </div>
        </div>
    );
};
