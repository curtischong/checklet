import { Suggestion } from "@api/ApiTypes";
import { CheckType } from "@components/create-checker/CheckerTypes";
import { singleEditDistance } from "@components/editor/singleEditDistance";
import classNames from "classnames";
import { AiOutlineArrowRight } from "react-icons/ai";

interface Props {
    suggestion: Suggestion;
    checkType: CheckType;
    onReplaceClick: () => void;
}

// this is the actual suggestion that the user can click on. it shows the change between the original text and edited text
export const SuggestionChange = ({
    suggestion,
    checkType,
    onReplaceClick,
}: Props): JSX.Element => {
    if (checkType === CheckType.highlight) {
        return <div>{suggestion.originalText}</div>;
    }

    // we are only going to show the changed original text
    const { editedRange, newRange } = singleEditDistance(
        suggestion.originalText,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        suggestion.editedText!,
    );

    const originalTextToChange = suggestion.originalText.substring(
        editedRange.start,
        editedRange.end,
    );

    return (
        <div className="flex flex-row">
            {suggestion.editedText ? (
                <div
                    className={classNames(
                        "line-through text-[#DC5262] whitespace-pre",
                    )}
                    style={{
                        textDecorationColor: "#DC5262",
                    }}
                >
                    {originalTextToChange}
                </div>
            ) : (
                <div
                    className={classNames(
                        "bg-[#f35769] hover:bg-[#DC5262] text-white rounded md:py-0 md:px-2 cursor-pointer whitespace-pre",
                    )}
                    style={{
                        textDecorationColor: "#DC5262",
                    }}
                >
                    {originalTextToChange}
                </div>
            )}
            {suggestion.editedText && (
                <>
                    <AiOutlineArrowRight className={"mx-3 mt-[5px]"} />
                    <div
                        onClick={onReplaceClick}
                        className="text-white hover:bg-[#1d8fdb] bg-[#189bf2] rounded md:py-0 md:px-2 cursor-pointer whitespace-pre"
                    >
                        {suggestion.editedText.substring(
                            newRange.start,
                            newRange.end,
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
