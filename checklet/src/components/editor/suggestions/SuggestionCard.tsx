import classnames from "classnames";
import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Suggestion } from "@api/ApiTypes";
import { CheckDescObj } from "@components/create-checker/CheckerTypes";
import { SuggestionChange } from "@components/editor/suggestions/SuggestionChange";
import classNames from "classnames";
import React from "react";

type SuggestionCard = {
    suggestion: Suggestion;
    activeSuggestion: Suggestion | undefined;
    onClick: () => void;
    onReplaceClick: (acceptedOption: string) => void;
    checkDescObj: CheckDescObj;
    classNames?: string;
    ref: React.RefObject<HTMLDivElement>;
};

const isEqual = (...objects: Suggestion[]) =>
    objects.every((obj) => JSON.stringify(obj) === JSON.stringify(objects[0]));

const SuggestionCard = React.forwardRef((props: SuggestionCard, ref) => {
    const { activeSuggestion, onClick, onReplaceClick, suggestion } = props;
    const isActive = useMemo(() => {
        if (activeSuggestion == null) {
            return false;
        }
        return isEqual(suggestion, activeSuggestion);
    }, [suggestion, activeSuggestion]);

    const originalText = suggestion.originalText;

    const checkDesc = props.checkDescObj[suggestion.checkId];
    if (!checkDesc) {
        // if we pressed check document, then the author of the checker disabled a check, then we press check document again, we will be missing some checkDescs
        // So we just don't render the card
        return <></>;
    }

    return (
        <div
            ref={ref as React.RefObject<HTMLDivElement>}
            className={classnames(
                "bg-white shadow-around",
                {
                    "w-full rounded-lg  p-4 mb-8 animate-open": isActive,
                    "flex w-full rounded-md p-4 mb-5 opacity-100": !isActive,
                },
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
            <div className={"flex overflow-hidden text-xs"} onClick={onClick}>
                {isActive ? (
                    <div
                        className={classNames(
                            "text-[#6e758b] cursor-pointer flex flex-row w-full",
                        )}
                    >
                        <div
                            className="flex-grow"
                            style={{
                                flexBasis: "0",
                            }}
                        >
                            {checkDesc.objInfo.name}
                        </div>
                        {/* <span
                                className={"p-[3px] rounded-xl bg-red-800 mx-8"}
                            /> */}
                        <div className="">{checkDesc.category}</div>
                    </div>
                ) : (
                    <>
                        <div
                            className={
                                "overflow-hidden whitespace-nowrap overflow-ellipsis max-w-[40%]"
                            }
                        >
                            {originalText}
                        </div>
                        <span
                            className={
                                "bg-red-600 rounded-full h-1 w-1 my-auto mx-2"
                            }
                        />
                        <div
                            className={
                                "overflow-hidden text-gray-600 font-normal"
                            }
                        >
                            {checkDesc.objInfo.name}
                        </div>
                    </>
                )}
            </div>
            {/* This is the card details when you open up the card */}
            {isActive && (
                <div className={"py-[15px] px-[10px]"}>
                    <div className={"text-base pb-4 flex"}>
                        <SuggestionChange
                            suggestion={suggestion}
                            checkType={checkDesc.checkType}
                            onReplaceClick={onReplaceClick}
                        />
                    </div>
                    <div className={`text-[13px]`}>
                        {" "}
                        <ReactMarkdown
                            className="whitespace-pre-wrap"
                            remarkPlugins={[remarkGfm]}
                        >
                            {checkDesc.objInfo.desc}
                        </ReactMarkdown>
                    </div>
                </div>
            )}
        </div>
    );
});

SuggestionCard.displayName = "SuggestionsCard";

export default SuggestionCard;
