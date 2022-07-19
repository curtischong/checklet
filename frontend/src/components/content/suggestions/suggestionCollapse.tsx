import React, { forwardRef, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Suggestion } from "./suggestionsTypes";
import classnames from "classnames";
import { capitalizeFirstLetter } from "util/capitalizeFirstLetter";

import css from "./suggestioncollapse.module.scss";

type SuggestionCollapseProps = {
    suggestion: Suggestion;
    index: number;
    activeKey: string;
    onClick: () => void;
    onReplaceClick: () => void;
};
export const SuggestionCollapse = forwardRef(
    (props: SuggestionCollapseProps, ref) => {
        const { index, activeKey, onClick, onReplaceClick, suggestion } = props;
        const isActive = useMemo(() => {
            return suggestion.id === activeKey;
        }, [index, activeKey]);

        const srcNaut = useMemo(() => {
            return capitalizeFirstLetter(suggestion.srcNautObj);
        }, [suggestion.srcNautObj]);

        const replacementText = useMemo(() => {
            return capitalizeFirstLetter(suggestion.replacementText);
        }, [suggestion.replacementText]);

        return (
            <div
                ref={ref as React.RefObject<HTMLDivElement>}
                className={classnames(
                    isActive ? css.containerActive : css.container,
                )}
            >
                <div className={css.header} onClick={onClick}>
                    <span className={css.bigDot} />
                    {isActive ? (
                        <div className={css.activeCategory}>
                            {suggestion.feedbackCategory}
                        </div>
                    ) : (
                        <>
                            <div className={css.srcNautObj}>
                                {suggestion.srcNautObj}
                            </div>
                            <span className={css.smallDot} />
                            <div className={css.shortDesc}>
                                {suggestion.shortDesc}
                            </div>
                        </>
                    )}
                </div>
                {isActive && (
                    <div className={css.cardBody}>
                        <div className={css.suggestion}>
                            {srcNaut && (
                                <div className={css.remove}>{srcNaut}</div>
                            )}
                            {suggestion.replacementText && (
                                <>
                                    <AiOutlineArrowRight
                                        className={css.arrow}
                                    />
                                    <div
                                        onClick={onReplaceClick}
                                        className={css.replace}
                                    >
                                        {replacementText}
                                    </div>
                                </>
                            )}
                        </div>
                        <div className={css.longDesc}>
                            {" "}
                            <ReactMarkdown
                                children={`${suggestion.longDesc}`}
                                remarkPlugins={[remarkGfm]}
                            />{" "}
                        </div>
                    </div>
                )}
            </div>
        );
    },
);
