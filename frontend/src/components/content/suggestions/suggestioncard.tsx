import { Collapse } from "antd";
import React from "react";
import css from "./suggestioncard.module.scss";
import { SuggestionCategory, Suggestion } from "./suggestionsTypes";
const { Panel } = Collapse;

export const SuggestionCard: React.FC<SuggestionCategory> = (
    props: SuggestionCategory,
) => {
    const { suggestions, categoryName, color } = props;
    // not sure if number should always be suggestions.length
    // could have separate prop for count and if not filled default to length
    const Header = (
        <div>
            <span className={css.number}>{suggestions.length}</span>
            {categoryName}
        </div>
    );

    return (
        <Collapse expandIconPosition="end" className="my-2">
            <Panel header={Header} style={{ backgroundColor: color }} key={1}>
                {suggestions.map((suggestion: Suggestion, index) => (
                    <p key={index}>{suggestion.suggestionText}</p>
                ))}
            </Panel>
        </Collapse>
    );
};
