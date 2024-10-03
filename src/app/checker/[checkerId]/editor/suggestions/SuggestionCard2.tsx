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
  onRemove: (suggestionId: string) => void; // New prop for removal
  classNames?: string;
}

const SuggestionComponent = React.forwardRef<HTMLDivElement, Props>(
  (props, ref) => {
    const {
      suggestion,
      activeSuggestion,
      onClick,
      onReplaceClick,
      onRemove,
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
        <div
          className="flex cursor-pointer overflow-hidden text-xs"
          onClick={onClick}
        >
          {isActive ? (
            <div className="text-gray-600">{suggestion.tipName}</div>
          ) : (
            <>
              <span className="max-w-[40%] overflow-hidden overflow-ellipsis whitespace-nowrap">
                {suggestion.oldText}
              </span>
              <span className="mx-2 my-auto h-1 w-1 rounded-full bg-red-600" />
              <span>{suggestion.tipName}</span>
            </>
          )}
        </div>
        {isActive && (
          <div className={"px-[10px] pt-[15px]"}>
            {diffResult.map((part, index) => {
              let partClass = "";
              if (part.added) {
                partClass = "font-bold text-green-500";
              } else if (part.removed) {
                partClass = "text-red-500 line-through";
              }
              return (
                <span key={index} className={partClass}>
                  {part.value}
                </span>
              );
            })}
            <div className="mt-2 text-sm text-gray-500">
              {suggestion.reason}
            </div>
            <div className="flex flex-row space-x-4">
              <button
                className="mt-4 rounded bg-green-600 px-4 py-1 text-white transition-colors duration-300 hover:bg-green-500"
                onClick={() => onReplaceClick(suggestion.newText)}
              >
                Accept
              </button>
              <button
                className="mt-4 rounded px-2 py-1 text-gray-400 transition-colors duration-300 hover:text-gray-700"
                onClick={() => onRemove(suggestion.suggestionId)} // Pass true to indicate rejection
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>
    );
  },
);

SuggestionComponent.displayName = "SuggestionComponent";

export default SuggestionComponent;
