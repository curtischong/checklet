import { Suggestion } from "@api/ApiTypes";
import { CheckType } from "@components/create-checker/CheckerTypes";
import classNames from "classnames";
import { AiOutlineArrowRight } from "react-icons/ai";

interface Props {
    suggestion: Suggestion;
    checkType: CheckType;
    onReplaceClick: () => void;
}

export const SuggestionChange = ({
    suggestion,
    checkType,
    onReplaceClick,
}: Props): JSX.Element => {
    if (checkType === CheckType.highlight) {
        return <div>{suggestion.originalText}</div>;
    }
    return (
        <div className="flex flex-row">
            {suggestion.editedText ? (
                <div
                    className={classNames(
                        "line-through text-[#DC5262] break-words",
                    )}
                    style={{
                        textDecorationColor: "#DC5262",
                    }}
                >
                    {suggestion.originalText}
                </div>
            ) : (
                <div
                    className={classNames(
                        "bg-[#f35769] hover:bg-[#DC5262] text-white rounded md:py-0 md:px-2 cursor-pointer break-words",
                    )}
                    style={{
                        textDecorationColor: "#DC5262",
                    }}
                >
                    {suggestion.originalText}
                </div>
            )}
            {suggestion.editedText && (
                <>
                    <AiOutlineArrowRight className={"mx-3 mt-[5px]"} />
                    <div
                        onClick={onReplaceClick}
                        className="text-white hover:bg-[#1d8fdb] bg-[#189bf2] rounded md:py-0 md:px-2 cursor-pointer break-words"
                    >
                        {suggestion.editedText}
                    </div>
                </>
            )}
        </div>
    );
};
