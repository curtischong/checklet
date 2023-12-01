import React, { forwardRef, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AiOutlineArrowRight } from "react-icons/ai";
import classnames from "classnames";

import css from "./suggestioncollapse.module.scss";
import { Suggestion } from "@api/ApiTypes";
import { CheckDescObj } from "@components/create-checker/CheckerTypes";

type SuggestionCollapseProps = {
    suggestion: Suggestion;
    activeKey: Suggestion | undefined;
    onClick: () => void;
    onReplaceClick: () => void;
    checkDescObj: CheckDescObj;
};

const isEqual = (...objects: Suggestion[]) =>
    objects.every((obj) => JSON.stringify(obj) === JSON.stringify(objects[0]));

export const SuggestionCollapse = forwardRef(
    (props: SuggestionCollapseProps, ref) => {
        const { activeKey, onClick, onReplaceClick, suggestion } = props;
        const isActive = useMemo(() => {
            if (activeKey == null) {
                return false;
            }
            return isEqual(suggestion, activeKey);
        }, [suggestion, activeKey]);

        // const srcNaut = useMemo(() => {
        //     return capitalizeFirstLetter(suggestion.srcNautObj);
        // }, [suggestion.srcNautObj]);

        // const replacementText = useMemo(() => {
        //     return capitalizeFirstLetter(suggestion.replacementText);
        // }, [suggestion.replacementText]);

        const srcNaut = suggestion.originalText;
        const replacementText = suggestion.editedText;

        const getCheckDesc = (suggestion: Suggestion) => {
            return props.checkDescObj[suggestion.checkId];
        };

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
                            {getCheckDesc(suggestion).name}
                            {/* <span
                                className={"p-[3px] rounded-xl bg-red-800 mx-8"}
                            /> */}
                            <div className="absolute right-4 top-2">
                                {getCheckDesc(suggestion).category}
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className={css.srcNautObj}>{srcNaut}</div>
                            <span className={css.smallDot} />
                            <div className={css.shortDesc}>
                                {getCheckDesc(suggestion).name}
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
                            {suggestion.editOps.length > 0 && (
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
                                children={`${
                                    getCheckDesc(suggestion).longDesc
                                }`}
                                remarkPlugins={[remarkGfm]}
                            />{" "}
                        </div>
                    </div>
                )}
            </div>
        );
    },
);
