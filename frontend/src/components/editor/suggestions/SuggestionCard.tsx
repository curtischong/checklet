import React, { forwardRef, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import classnames from "classnames";

import css from "./suggestionCard.module.scss";
import { Suggestion } from "@api/ApiTypes";
import { CheckDescObj } from "@components/create-checker/CheckerTypes";
import classNames from "classnames";
import { SuggestionChange } from "@components/editor/suggestions/SuggestionChange";

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
                        {getCheckDesc(suggestion).objInfo.name}
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
                            {getCheckDesc(suggestion).objInfo.name}
                        </div>
                    </>
                )}
            </div>
            {/* This is the card details when you open up the card */}
            {isActive && (
                <div className={css.cardBody}>
                    <div className={css.suggestion}>
                        <SuggestionChange
                            suggestion={suggestion}
                            checkType={checkType}
                            onReplaceClick={onReplaceClick}
                        />
                    </div>
                    <div className={css.desc}>
                        {" "}
                        <ReactMarkdown
                            children={`${
                                getCheckDesc(suggestion).objInfo.desc
                            }`}
                            remarkPlugins={[remarkGfm]}
                        />{" "}
                    </div>
                </div>
            )}
        </div>
    );
});
