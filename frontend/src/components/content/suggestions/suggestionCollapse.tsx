import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Suggestion, SuggestionCategory } from "./suggestionsTypes";
import classnames from "classnames";
import { capitalizeFirstLetter } from "util/capitalizeFirstLetter";

import css from "./suggestioncollapse.module.scss";

type SuggestionCollapseProps = {
    suggestion: Suggestion;
    index: number;
    activeKey: number;
    onClick: () => void;
};

export const SuggestionCollapse: React.FC<SuggestionCollapseProps> = (
    props: SuggestionCollapseProps,
) => {
    const { index, activeKey, onClick, suggestion } = props;
    console.log(suggestion);
    const isActive = React.useMemo(() => {
        return index === activeKey;
    }, [index, activeKey]);

    const srcNaut = React.useMemo(() => {
        return capitalizeFirstLetter(suggestion.srcNautObj);
    }, [suggestion.srcNautObj]);

    const replacementText = React.useMemo(() => {
        return capitalizeFirstLetter(suggestion.replacementText);
    }, [suggestion.replacementText]);

    return (
        <div
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
                        {srcNaut && <div className={css.remove}>{srcNaut}</div>}
                        {suggestion.replacementText && (
                            <>
                                <AiOutlineArrowRight className={css.arrow} />
                                <div className={css.replace}>
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
};
