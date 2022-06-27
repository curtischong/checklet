import { Collapse } from "antd";
import React from "react";
import css from "./suggestioncard.module.scss";
import { Suggestion, SuggestionCategory } from "./suggestionsTypes";
const { Panel } = Collapse;

export const SuggestionCard: React.FC<SuggestionCategory> = (
    suggestionCategory: SuggestionCategory,
) => {
    const { color, suggestions } = suggestionCategory;

    const Header = (
        <div>
            <span className={css.number}>{suggestions.length ?? 0}</span>
            {suggestions[0].shortDesc}
        </div>
    );

    return (
        <Collapse expandIconPosition="end" className="my-2">
            <Panel header={Header} style={{ backgroundColor: color }} key={1}>
                <div>
                    <p>{suggestions[0].longDesc}</p>
                    <ol>
                        {suggestions.map((suggestion, index) => {
                            return (
                                <li key={index}>
                                    Position: {suggestion.srcWord.startChar}{" "}
                                    Word: {suggestion.srcWord.text}{" "}
                                </li>
                            );
                        })}
                    </ol>
                </div>
            </Panel>
        </Collapse>
    );
};
