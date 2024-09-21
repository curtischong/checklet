import { DownArrowWithTailIcon } from "@/app/_components/icons/DownArrowWithTailIcon";
import { RightArrowWithTailIcon } from "@/app/_components/icons/RightArrowWithTailIcon";
import { CheckType } from "@/app/checker/[checkerId]/edit/CheckerTypes";
import { type Suggestion } from "@/app/checker/[checkerId]/editor/suggestions/suggestionsTypes";
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
          "cursor-pointer select-none whitespace-pre-wrap break-words rounded bg-[#f35769] text-white hover:bg-[#DC5262] md:px-2 md:py-0",
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
      suggestion.editedText.reduce((sum, text) => sum + text.length, 0) > 30);
  return (
    <div
      className={classNames("flex", {
        "mx-auto flex-col": showReplacementVertically,
        "flex-row items-center": !showReplacementVertically,
      })}
    >
      <div
        className={classNames(
          "select-none whitespace-pre-wrap text-[#DC5262] line-through",
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
        <DownArrowWithTailIcon className="mx-auto mb-[8px] mt-[6px]" />
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
              className="cursor-pointer select-none whitespace-pre-wrap rounded bg-[#189bf2] px-2 py-[1px] text-white hover:bg-[#1d8fdb]"
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
