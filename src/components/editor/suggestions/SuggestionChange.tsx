import { DownArrowWithTailIcon } from "@/components/icons/DownArrowWithTailIcon";
import { RightArrowWithTailIcon } from "@/components/icons/RightArrowWithTailIcon";
import { Suggestion } from "@api/ApiTypes";
import { CheckType } from "@components/create-checker/CheckerTypes";
import classNames from "classnames";

interface Props {
    suggestion: Suggestion;
    checkType: CheckType;
    onReplaceClick: (acceptedOption: string) => void;
}

export const SuggestionChange = ({
    suggestion,
    checkType,
    onReplaceClick,
}: Props): JSX.Element => {
    if (checkType === CheckType.highlight) {
        return <div>{suggestion.originalText}</div>;
    }

    if (suggestion.editedText[0] === "") {
        return (
            <div
                className={classNames(
                    "bg-[#f35769] hover:bg-[#DC5262] text-white rounded md:py-0 md:px-2 cursor-pointer break-words whitespace-pre-wrap select-none",
                )}
                style={{
                    textDecorationColor: "#DC5262",
                    wordBreak: "break-word",
                }}
            >
                {suggestion.originalText}
            </div>
        );
    }

    const showReplacementVertically =
        suggestion.originalText.includes("\n") ||
        suggestion.editedText?.includes("\n") ||
        suggestion.originalText.length > 50 ||
        // (suggestion.editedText &&
        //     (suggestion.editedText.length > 1 ||
        //         suggestion.editedText[0].length > 50));
        (suggestion.editedText &&
            suggestion.editedText.reduce((sum, text) => sum + text.length, 0) >
                30);
    return (
        <div
            className={classNames("flex", {
                "flex-col mx-auto": showReplacementVertically,
                "flex-row items-center": !showReplacementVertically,
            })}
        >
            <div
                className={classNames(
                    "line-through text-[#DC5262] whitespace-pre-wrap select-none",
                )}
                // https://stackoverflow.com/questions/12699800/smarter-word-break-in-css
                style={{
                    textDecorationColor: "#DC5262",
                    wordBreak: "break-word",
                }}
            >
                {suggestion.originalText}
            </div>
            {showReplacementVertically ? (
                <DownArrowWithTailIcon className="mt-[6px] mb-[8px] mx-auto" />
            ) : (
                <RightArrowWithTailIcon className={"mx-3 mt-[5px] w-[50px]"} />
            )}
            <div
                className={classNames("flex", {
                    "flex-col space-y-1": showReplacementVertically,
                    "flex-row space-x-1": !showReplacementVertically,
                })}
            >
                {suggestion.editedText.map((option, idx) => {
                    return (
                        <div
                            key={`edited-text-${idx}`}
                            onClick={() => onReplaceClick(option)}
                            className="text-white hover:bg-[#1d8fdb] bg-[#189bf2] rounded py-[1px] px-2 cursor-pointer whitespace-pre-wrap select-none"
                            style={{
                                wordBreak: "break-word",
                            }}
                        >
                            {option}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
