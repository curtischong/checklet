import { Suggestion } from "@api/ApiTypes";
import { CheckType } from "@components/create-checker/CheckerTypes";
import classNames from "classnames";
import { AiOutlineArrowDown, AiOutlineArrowRight } from "react-icons/ai";

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
    const showReplacementVertically =
        suggestion.originalText.includes("\n") ||
        suggestion.editedText?.includes("\n") ||
        suggestion.originalText.length > 50 ||
        (suggestion.editedText &&
            (suggestion.editedText.length > 1 ||
                suggestion.editedText[0].length > 50));
    return (
        <div
            className={classNames("flex", {
                "flex-col mx-auto": showReplacementVertically,
                "flex-row": !showReplacementVertically,
            })}
        >
            {suggestion.editedText ? (
                <div
                    className={classNames(
                        "line-through text-[#DC5262] whitespace-pre-wrap",
                    )}
                    // https://stackoverflow.com/questions/12699800/smarter-word-break-in-css
                    style={{
                        textDecorationColor: "#DC5262",
                        wordBreak: "break-word",
                    }}
                >
                    {suggestion.originalText}
                </div>
            ) : (
                <div
                    className={classNames(
                        "bg-[#f35769] hover:bg-[#DC5262] text-white rounded md:py-0 md:px-2 cursor-pointer break-words whitespace-pre-wrap",
                    )}
                    style={{
                        textDecorationColor: "#DC5262",
                        wordBreak: "break-word",
                    }}
                >
                    {suggestion.originalText}
                </div>
            )}
            {showReplacementVertically ? (
                <AiOutlineArrowDown className="mt-[6px] mb-[8px] mx-auto" />
            ) : (
                <AiOutlineArrowRight className={"mx-3 mt-[5px] w-[50px]"} />
            )}
            <div className="flex flex-col space-y-1">
                {suggestion.editedText.map((option, idx) => {
                    return (
                        <div
                            key={`edited-text-${idx}`}
                            onClick={() => onReplaceClick(option)}
                            className="text-white hover:bg-[#1d8fdb] bg-[#189bf2] rounded md:py-0 md:px-2 cursor-pointer whitespace-pre-wrap"
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
