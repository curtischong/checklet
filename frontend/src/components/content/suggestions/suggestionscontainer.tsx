import { Divider } from "antd";
import React from "react";

import { SuggestionMetric } from "./suggestionmetric";
import {
    LengthMetric,
    Suggestion,
    SuggestionCategory,
} from "./suggestionsTypes";
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

export type SuggestionsContainerProps = {
    suggestions: SuggestionCategory[];
};

export const SuggestionsContainer: React.FC<SuggestionsContainerProps> = (
    props: SuggestionsContainerProps,
) => {
    const { suggestions } = props;

    return (
        <div className="col-span-2">
            <div className="font-bold pb-4 pt-1">Suggestions</div>
            <div className="px-4">
                {metrics.map((metric, index) => (
                    <SuggestionMetric {...metric} key={index} />
                ))}
                <Divider className={css.divider} />
                {/* TODO: Add zero state */}
                {suggestions != null &&
                    suggestions.map((cat: any, index) => (
                        <SuggestionCard {...cat} key={index} />
                    ))}
            </div>
        </div>
    );
};
