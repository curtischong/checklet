import React from "react";
import classnames from "classnames";
import { Suggestion } from "./suggestionsTypes";
import css from "./suggestions.module.scss";
import { SuggestionCollapse } from "./suggestionCollapse";
import ZeroImage from "./ZeroState.png";
import { ContainerHeader } from "../containerHeader";
import { mixpanelTrack } from "src/utils";

export type SuggestionsContainerProps = {
    suggestions: Suggestion[];
    refs: { [key: string]: any };
    activeKey: string;
    setActiveKey: (k: string) => void;
};

export const SuggestionsContainer: React.FC<SuggestionsContainerProps> = (
    props: SuggestionsContainerProps,
) => {
    const { suggestions, refs, activeKey, setActiveKey } = props;

    const suggestionsHeader = (
        <div className="font-bold text-16 pb-4 pt-1 flex">
            {suggestions.length > 0 && (
                <div className={classnames(css.number)}>
                    {suggestions.length}
                </div>
            )}
            All Suggestions
        </div>
    );

    const onCollapseClick = (s: Suggestion) => {
        mixpanelTrack("Suggestion opened", {
            suggestion: s,
        });
        setActiveKey(s.id);
    };

    return (
        <div className="col-span-2">
            <ContainerHeader header={suggestionsHeader} />
            <div
                className="px-4"
                style={{ maxHeight: "calc(100vh - 61px)", overflow: "auto" }}
            >
                {suggestions.length > 0 ? (
                    suggestions.map((s: Suggestion, index: number) => {
                        return (
                            <SuggestionCollapse
                                key={index}
                                suggestion={s}
                                index={index}
                                activeKey={activeKey}
                                onClick={() => onCollapseClick(s)}
                                ref={
                                    refs[
                                        s.highlightRanges[0].startPos +
                                            "," +
                                            s.highlightRanges[0].endPos +
                                            s.srcNautObj
                                    ]
                                }
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
