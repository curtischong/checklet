/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { NormalTextArea } from "@/app/_components/ui/TextArea";
import { type Suggestion } from "@/app/checker/[checkerId]/editor/suggestions/suggestionsTypes";
import { diffWords } from "diff";
import React, { useEffect, useMemo, useRef, useState } from "react";

interface Props {
  suggestion: Suggestion;
  activeSuggestion: Suggestion | undefined;
  onClick: () => void;
  onAccept: (acceptedOption: string) => void;
  onDismiss: (suggestionId: string) => void;
  onRegenerate: (suggestion: Suggestion, regenPrompt: string) => void; // New handler for regenerating
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
      onRegenerate,
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

    // State to manage regenerating
    const [isRegeneratingUiShown, setIsRegeneratingUiShown] = useState(false);
    const [regeneratePrompt, setRegeneratePrompt] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Focus the textarea when it becomes visible
    useEffect(() => {
      if (isRegeneratingUiShown && textareaRef.current) {
        textareaRef.current.focus();
      }
    }, [isRegeneratingUiShown]);

    const handleRegenerate = () => {
      setIsRegeneratingUiShown(true);
    };

    const handleRegenerateSubmit = () => {
      onRegenerate(suggestion, regeneratePrompt);
      setIsRegeneratingUiShown(false);
      setRegeneratePrompt("");
    };

    const handleCancelRegenerate = () => {
      setIsRegeneratingUiShown(false);
      setRegeneratePrompt("");
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
            {isRegeneratingUiShown ? (
              <div className="mt-4">
                <p className="text-sm text-slate-600">
                  What changes to make when regenerating?
                </p>
                <NormalTextArea
                  ref={textareaRef}
                  className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2"
                  value={regeneratePrompt}
                  onChange={(e) => setRegeneratePrompt(e.target.value)}
                  minRows={3}
                  placeholder="e.g. Use a different verb"
                />
                <div className="mt-2 flex space-x-2">
                  <button
                    className="rounded bg-green-600 px-4 py-2 text-white transition-colors duration-300 hover:bg-green-500"
                    onClick={handleRegenerateSubmit}
                  >
                    Regenerate Suggestion
                  </button>
                  <button
                    className="rounded px-4 py-2 text-gray-400 transition-colors duration-300 hover:text-gray-700"
                    onClick={handleCancelRegenerate}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 flex flex-row space-x-4">
                {suggestion.newText !== undefined && (
                  <>
                    <button
                      className="rounded bg-green-600 px-4 py-1 text-white transition-colors duration-300 hover:bg-green-500"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the parent onClick
                        onAccept(suggestion.newText!);
                      }}
                    >
                      Accept
                    </button>
                    <button
                      className="rounded px-2 py-1 text-blue-400 transition-colors duration-300 hover:text-blue-600"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the parent onClick
                        handleRegenerate();
                      }}
                    >
                      Regenerate
                    </button>
                  </>
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
