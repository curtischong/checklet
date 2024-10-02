/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { type Suggestion } from "@/app/checker/[checkerId]/editor/suggestions/suggestionsTypes";
import { diffWords } from "diff";
import React, { useMemo } from "react";

interface Props {
  suggestion: Suggestion;
  activeSuggestion: Suggestion | undefined;
  onClick: () => void;
  onReplaceClick: (acceptedOption: string) => void;
  classNames?: string;
}

const SuggestionComponent = React.forwardRef<HTMLDivElement, Props>(
  (props, ref) => {
    const {
      suggestion,
      activeSuggestion,
      onClick,
      onReplaceClick,
      classNames,
    } = props;

    const isActive = useMemo(() => {
      if (activeSuggestion == null) {
        return false;
      }
      return JSON.stringify(suggestion) === JSON.stringify(activeSuggestion);
    }, [suggestion, activeSuggestion]);

    const diffResult = useMemo(() => {
      return diffWords(suggestion.oldText, suggestion.newText);
    }, [suggestion.oldText, suggestion.newText]);

    return (
      <div
        ref={ref}
        className={`max-w-[350px] bg-white shadow-around ${isActive ? "mb-8 w-full animate-open rounded-lg p-4" : "mb-5 flex w-full rounded-md p-4 opacity-100"} ${classNames} ${!isActive ? "cursor-pointer" : ""}`}
        onClick={() => {
          if (!isActive) {
            onClick();
          }
        }}
      >
        <div className="flex overflow-hidden text-xs">
          {isActive ? (
            <div className="flex w-full cursor-pointer flex-row text-[#6e758b]">
              <div className="flex-grow" style={{ flexBasis: "0" }}>
                {suggestion.tipName}
              </div>
            </div>
          ) : (
            <div className="flex">
              <div className="flex-grow overflow-hidden overflow-ellipsis whitespace-nowrap">
                {diffResult.map((part, index) => {
                  let partClass = "";
                  if (part.added) {
                    partClass = "font-bold";
                  } else if (part.removed) {
                    partClass = "text-gray-500 line-through";
                  }
                  return (
                    <span key={index} className={partClass}>
                      {part.value}
                    </span>
                  );
                })}
              </div>
              <div className="ml-2 overflow-hidden font-normal text-gray-600">
                {suggestion.tipName}
              </div>
            </div>
          )}
        </div>
        {isActive && (
          <div className="px-[10px] py-[15px]">
            <div className="flex pb-4 text-base">
              {/* Assuming SuggestionChange is modified similarly or adjusted accordingly */}
              <SuggestionChange
                suggestion={suggestion}
                checkType={CheckType.rephrase}
                onReplaceClick={onReplaceClick}
              />
            </div>
            <div className="text-[13px]">
              <Markdown remarkPlugins={[remarkGfm]}>
                {suggestion.reason}
              </Markdown>
            </div>
          </div>
        )}
      </div>
    );
  },
);

SuggestionComponent.displayName = "SuggestionComponent";

export default SuggestionComponent;
