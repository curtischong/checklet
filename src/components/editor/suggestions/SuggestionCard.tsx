import { Suggestion } from "@api/ApiTypes";
import { CheckDescObj } from "@components/create-checker/CheckerTypes";
import { SuggestionChange } from "@components/editor/suggestions/SuggestionChange";
import { default as classNames, default as classnames } from "classnames";
import React, { useMemo } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
// https://github.com/remarkjs/react-markdown/tree/website

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

    // const treatedContent = checkDesc.objInfo.desc;
    // const treatedContent = checkDesc.objInfo.desc.replace(
    //     // /(?<=\n\n)(?![*-])\n/gi,
    //     // /(?<=\n)(?![*-])\n/gi,
    //     /(?<=\n)\n/gi,
    //     "\\\n",
    // );
    // const treatedContent = checkDesc.objInfo.desc.replace(/\n/gi, "\n &nbsp;");
    const lines = checkDesc.objInfo.desc.split("\n");
    let treatedContent = lines.length > 0 ? lines[0] : "";
    for (let i = 1; i < lines.length; i++) {
        const prevLine = lines[i - 1];
        const line = lines[i];
        const prevTrimmedLine = prevLine.trim();
        const trimmedLine = line.trim();
        // the previous line is a list
        if (["*", "-", "+"].includes(prevTrimmedLine[0])) {
            treatedContent += "\n\n" + line; // If we don't do this, then all future lines undeneath the bullet point will be treated as a bullet point
            continue;
        }

        if (trimmedLine.length === 0) {
            treatedContent += "\\\n";
            continue;
        }
        if (prevTrimmedLine.length === 0) {
            treatedContent += "\\\n" + line;
        } else {
            treatedContent += "\n\n" + line;
        }
    }

    return (
        <div
            ref={ref as React.RefObject<HTMLDivElement>}
            className={classnames(
                "bg-white shadow-around max-w-[350px]",
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
                        <Markdown
                            // className="whitespace-pre"
                            remarkPlugins={[remarkGfm]}
                            // remarkPlugins={[remarkGfm]}
                        >
                            {treatedContent}
                        </Markdown>
                    </div>
                </div>
            )}
        </div>
    );
});

SuggestionCard.displayName = "SuggestionsCard";

export default SuggestionCard;
