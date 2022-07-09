import React, { useState } from "react";
import classnames from "classnames";
import { LengthMetric, Suggestion } from "./suggestionsTypes";
import css from "./suggestions.module.scss";
import { SuggestionCollapse } from "./suggestionCollapse";
import ZeroImage from "./ZeroState.png";

export type SuggestionsContainerProps = {
    suggestions: Suggestion[];
};

export const SuggestionsContainer: React.FC<SuggestionsContainerProps> = (
    props: SuggestionsContainerProps,
) => {
    const { suggestions } = props;
    const [activeKey, setActiveKey] = useState<number>(0);

    return (
        <div className="col-span-2">
            <div className="font-bold text-16 pb-4 pt-1 flex">
                {suggestions.length > 0 && (
                    <div className={classnames(css.number)}>
                        {suggestions.length}
                    </div>
                )}
                All Suggestions
            </div>

            <div className="px-4">
                {suggestions.length > 0 ? (
                    suggestions.map((cat: Suggestion, index: number) => {
                        return (
                            <SuggestionCollapse
                                key={index}
                                suggestion={cat}
                                index={index}
                                activeKey={activeKey}
                                onClick={() => setActiveKey(index)}
                            />
                        );
                    })
                ) : (
                    <div className={css.zeroState}>
                        <img src={ZeroImage.src} />
                        <div className={css.header}> Nothing to check yet </div>
                        <div>
                            {" "}
                            Start writing or paste your resume to see Nautilus's
                            feedback.{" "}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
