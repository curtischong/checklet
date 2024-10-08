/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { type Suggestion } from "@/app/checker/[checkerId]/editor/suggestions/suggestionsTypes";
import { diffWords } from "diff";
import React, { useEffect, useMemo, useRef, useState } from "react";

interface Props {
  suggestion: Suggestion;
  activeSuggestion: Suggestion | undefined;
  onClick: () => void;
  onAccept: (acceptedOption: string) => void;
  onDismiss: (suggestionId: string) => void;
  onReword: (suggestionId: string, newReword: string) => void; // New handler for rewording
  classNames?: string;
}

const SuggestionComponent = React.forwardRef<HTMLDivElement, Props>(
  (props, ref) => {
    const {
      suggestion,
      activeSuggestion,
      onClick,
      onAccept,
      onDismiss,
      onReword, // Destructure the new handler
      classNames,
    } = props;

    const isActive = useMemo(() => {
      if (activeSuggestion == null) {
        return false;
      }
      return JSON.stringify(suggestion) === JSON.stringify(activeSuggestion);
    }, [suggestion, activeSuggestion]);

    const diffResult = useMemo(() => {
      if (!suggestion.newText) {
        return [];
      } // if there is no newText, this is a highlight suggestion. so return no diff
      return diffWords(
        suggestion.oldText,
        suggestion.newText ?? suggestion.oldText,
      );
    }, [suggestion.oldText, suggestion.newText]);

    // State to manage rewording
    const [isRewording, setIsRewording] = useState(false);
    const [rewordText, setRewordText] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Focus the textarea when it becomes visible
    useEffect(() => {
      if (isRewording && textareaRef.current) {
        textareaRef.current.focus();
      }
    }, [isRewording]);

    const handleReword = () => {
      setIsRewording(true);
      setRewordText(suggestion.newText || "");
    };

    const handleRewordSubmit = () => {
      onReword(suggestion.suggestionId, rewordText);
      setIsRewording(false);
      setRewordText("");
    };

    const handleCancelReword = () => {
      setIsRewording(false);
      setRewordText("");
    };

    return (
      <div
        ref={ref}
        className={`max-w-[350px] bg-white shadow-around ${
          isActive
            ? "mb-8 w-full animate-open rounded-lg p-4"
            : "mb-5 flex w-full rounded-md p-4 opacity-100"
        } ${classNames} ${!isActive ? "cursor-pointer" : ""}`}
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
            {isRewording ? (
              <div className="mt-4">
                <textarea
                  ref={textareaRef}
                  className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={rewordText}
                  onChange={(e) => setRewordText(e.target.value)}
                  rows={3}
                  placeholder="Reword your suggestion here..."
                />
                <div className="mt-2 flex space-x-2">
                  <button
                    className="rounded bg-blue-600 px-4 py-2 text-white transition-colors duration-300 hover:bg-blue-500"
                    onClick={handleRewordSubmit}
                  >
                    Reword Suggestion
                  </button>
                  <button
                    className="rounded bg-gray-300 px-4 py-2 text-gray-700 transition-colors duration-300 hover:bg-gray-400"
                    onClick={handleCancelReword}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 flex flex-row space-x-4">
                {suggestion.newText !== undefined && (
                  <button
                    className="rounded bg-green-600 px-4 py-1 text-white transition-colors duration-300 hover:bg-green-500"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the parent onClick
                      onAccept(suggestion.newText!);
                    }}
                  >
                    Accept
                  </button>
                )}
                <button
                  className="rounded px-2 py-1 text-gray-400 transition-colors duration-300 hover:text-gray-700"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the parent onClick
                    onDismiss(suggestion.suggestionId);
                  }}
                >
                  Dismiss
                </button>
                <button
                  className="rounded px-2 py-1 text-blue-500 transition-colors duration-300 hover:text-blue-700"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the parent onClick
                    handleReword();
                  }}
                >
                  Reword
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);

SuggestionComponent.displayName = "SuggestionComponent";

export default SuggestionComponent;
