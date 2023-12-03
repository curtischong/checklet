import React, { forwardRef, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AiOutlineArrowRight } from "react-icons/ai";
import classnames from "classnames";

import css from "./suggestioncollapse.module.scss";
import { Suggestion } from "@api/ApiTypes";
import {
    CheckDescObj,
    CheckType,
} from "@components/create-checker/CheckerTypes";
import classNames from "classnames";

type SuggestionCollapseProps = {
    suggestion: Suggestion;
    activeSuggestion: Suggestion | undefined;
    onClick: () => void;
    onReplaceClick: () => void;
    checkDescObj: CheckDescObj;
    classNames?: string;
};

const isEqual = (...objects: Suggestion[]) =>
    objects.every((obj) => JSON.stringify(obj) === JSON.stringify(objects[0]));

export const SuggestionCollapse = forwardRef(
    (props: SuggestionCollapseProps, ref) => {
        const { activeSuggestion, onClick, onReplaceClick, suggestion } = props;
        const isActive = useMemo(() => {
            if (activeSuggestion == null) {
                return false;
            }
            return isEqual(suggestion, activeSuggestion);
        }, [suggestion, activeSuggestion]);

        const originalText = suggestion.originalText;
        const replacementText = suggestion.editedText;

        const getCheckDesc = (suggestion: Suggestion) => {
            return props.checkDescObj[suggestion.checkId];
        };

        const checkType = getCheckDesc(suggestion).checkType;

        return (
            <div
                ref={ref as React.RefObject<HTMLDivElement>}
                className={classnames(
                    isActive ? css.containerActive : css.container,
                    props.classNames,
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
                            <div className={css.srcNautObj}>{originalText}</div>
                            <span className={css.smallDot} />
                            <div className={css.shortDesc}>
                                {getCheckDesc(suggestion).name}
                            </div>
                        </>
                    )}
                </div>
                {/* This is the card details when you open up the card */}
                {isActive && (
                    <div className={css.cardBody}>
                        <div className={css.suggestion}>
                            {originalText && (
                                <div
                                    className={classNames({
                                        "line-through":
                                            checkType === CheckType.rephrase,
                                    })}
                                    style={
                                        checkType === CheckType.rephrase
                                            ? {
                                                  textDecorationColor:
                                                      "#DC5262",
                                              }
                                            : {}
                                    }
                                >
                                    {originalText}
                                </div>
                            )}
                            {suggestion.editedText.length > 0 && (
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
                        {/* <div className={"mt-4"}>
                            <div className="font-bold">Examples:</div>
                            {getCheckDesc(suggestion).positiveExamples.map(
                                (example, idx) => {
                                            // text decoration colors aren't supported?https://github.com/tailwindlabs/tailwindcss/discussions/2050 
                                    return (
                                        <div
                                            className="flex flex-row"
                                            key={`positiveExample-${suggestion.checkId}-${idx}`}
                                        >
                                            <div
                                                className="line-through"
                                                style={{
                                                    textDecorationColor:
                                                        "#DC5262",
                                                }}
                                            >
                                                {example.originalText}
                                            </div>
                                            <AiOutlineArrowRight
                                                className={css.arrow}
                                            />
                                            <div
                                                onClick={onReplaceClick}
                                                className={css.replace}
                                            >
                                                {example.editedText}
                                            </div>
                                        </div>
                                    );
                                },
                            )}
                        </div> */}
                    </div>
                )}
            </div>
        );
    },
);
