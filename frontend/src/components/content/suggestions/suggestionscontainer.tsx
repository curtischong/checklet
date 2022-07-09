import { Collapse, Divider } from "antd";
import React, { useState } from "react";

import { SuggestionMetric } from "./suggestionmetric";
import {
    LengthMetric,
    Suggestion,
    SuggestionCategory,
} from "./suggestionsTypes";
import css from "./suggestions.module.scss";
import { SuggestionCard } from "./suggestioncard";
import { SuggestionCollapse } from "./suggestionCollapse";

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
    const [activeKey, setActiveKey] = useState<number>(0);

    return (
        <div className="col-span-2">
            <div className="font-bold pb-4 pt-1">Suggestions</div>
            <div className="px-4">
                {suggestions &&
                    suggestions.map(
                        (cat: SuggestionCategory, index: number) => {
                            return (
                                <SuggestionCollapse
                                    suggestion={cat.suggestions[0]}
                                    index={index}
                                    activeKey={activeKey}
                                    onClick={() => setActiveKey(index)}
                                />
                            );
                        },
                    )}
                {/* </Collapse> */}
            </div>
        </div>
    );
};
