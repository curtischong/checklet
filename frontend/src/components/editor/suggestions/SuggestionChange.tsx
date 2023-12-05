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
    return (
        <>
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
                        {suggestion.originalText}
                    </div>
                    <AiOutlineArrowRight className={"mx-auto md:mx-2"} />
                    <div
                        onClick={onReplaceClick}
                        className="text-white bg-blue-600 rounded md:py-0 md:px-2 cursor-pointer"
                    >
                        {suggestion.editedText}
                    </div>
                </div>
            )}
        </>
    );
};
