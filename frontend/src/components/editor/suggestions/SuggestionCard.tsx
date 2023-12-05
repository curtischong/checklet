import React, { forwardRef, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AiOutlineArrowRight } from "react-icons/ai";
import classnames from "classnames";

import css from "./suggestionCard.module.scss";
import { Suggestion } from "@api/ApiTypes";
import {
    CheckDescObj,
    CheckType,
} from "@components/create-checker/CheckerTypes";
import classNames from "classnames";

type SuggestionCard = {
    suggestion: Suggestion;
    activeSuggestion: Suggestion | undefined;
    onClick: () => void;
    onReplaceClick: () => void;
    checkDescObj: CheckDescObj;
    classNames?: string;
};

const isEqual = (...objects: Suggestion[]) =>
    objects.every((obj) => JSON.stringify(obj) === JSON.stringify(objects[0]));

export const SuggestionCard = forwardRef((props: SuggestionCard, ref) => {
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
                "bg-white",
                isActive ? css.containerActive : css.container,
                props.classNames,
                {
                    "cursor-pointer": !isActive,
                },
            )}
            onClick={() => {
                if (!isActive) {
                    onClick();
                }
            }}
        >
            <div className={css.header} onClick={onClick}>
                <span className={css.bigDot} />
                {isActive ? (
                    <div
                        className={classNames(
                            css.activeCategory,
                            "cursor-pointer",
                        )}
                    >
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
                        {checkType === CheckType.highlight ? (
                            <div>{suggestion.originalText}</div>
                        ) : (
                            <div className="flex flex-row">
                                <div
                                    className={classNames("line-through")}
                                    style={{
                                        textDecorationColor: "#DC5262",
                                    }}
                                >
                                    {originalText}
                                </div>
                                <AiOutlineArrowRight className={css.arrow} />
                                <div
                                    onClick={onReplaceClick}
                                    className={classNames(
                                        css.replace,
                                        "cursor-pointer",
                                    )}
                                >
                                    {replacementText}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={css.longDesc}>
                        {" "}
                        <ReactMarkdown
                            children={`${getCheckDesc(suggestion).longDesc}`}
                            remarkPlugins={[remarkGfm]}
                        />{" "}
                    </div>
                </div>
            )}
        </div>
    );
});
