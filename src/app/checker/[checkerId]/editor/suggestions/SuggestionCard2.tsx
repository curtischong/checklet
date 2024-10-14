/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { NormalTextArea } from "@/app/_components/ui/TextArea";
import { Tooltip } from "@/app/_components/ui/ToolTip";
import { type Suggestion } from "@/app/checker/[checkerId]/editor/suggestions/suggestionsTypes";
import { type SetState } from "@/utils/types";
import { diffWords } from "diff";
import React, { useEffect, useMemo, useRef, useState } from "react";

interface Props {
  suggestion: Suggestion;
  activeSuggestion: Suggestion | undefined;
  onClick: () => void;
  onAccept: (acceptedOption: string) => void;
  onDismiss: (suggestionId: string) => void;
  onRegenerate: (suggestion: Suggestion, regenPrompt: string) => void; // New handler for regenerating
  isRegenerating: boolean; // New prop to indicate regeneration state
  classNames?: string;
}

const Spinner: React.FC = () => (
  <div className="flex items-center justify-center">
    <svg
      className="h-5 w-5 animate-spin text-gray-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      ></path>
    </svg>
  </div>
);

const enum SuggestionState {
  Default,
  Regenerating,
  Editing,
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
      isRegenerating,
      classNames,
    } = props;

    const isActive = useMemo(() => {
      if (activeSuggestion == null) {
        return false;
      }
      return JSON.stringify(suggestion) === JSON.stringify(activeSuggestion);
    }, [suggestion, activeSuggestion]);

    const diffResult = useMemo(() => {
      if (suggestion.newText === undefined) {
        // if there is no newText, this is a highlight suggestion. so return no diff
        // explicitly check if newText is undefined because newText can be "", which is falsy
        return [];
      }
      return diffWords(suggestion.oldText, suggestion.newText);
    }, [suggestion.oldText, suggestion.newText]);

    // State to manage regenerating UI visibility
    const [suggestionState, setSuggestionState] = useState(
      SuggestionState.Default,
    );

    return (
      <div
        ref={ref}
        className={`bg-white shadow-around ${
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
                <span key={`${part.value}${index}`} className={partClass}>
                  {part.value}
                </span>
              );
            })}
            <div className="mt-2 text-sm text-gray-500">
              {suggestion.reason}
            </div>
            {isRegenerating ? (
              <Spinner />
            ) : (
              <>
                {suggestionState === SuggestionState.Default ? (
                  <DefaultSuggestionBody
                    suggestion={suggestion}
                    onAccept={onAccept}
                    onDismiss={onDismiss}
                    setSuggestionState={setSuggestionState}
                  />
                ) : suggestionState === SuggestionState.Regenerating ? (
                  <RegenerateSuggestionBody
                    suggestion={suggestion}
                    onRegenerate={onRegenerate}
                    setSuggestionState={setSuggestionState}
                  />
                ) : (
                  <EditSuggestionBody
                    suggestion={suggestion}
                    onAccept={onAccept}
                    setSuggestionState={setSuggestionState}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  },
);

interface DefaultSuggestionBodyProps {
  suggestion: Suggestion;
  onAccept: (acceptedOption: string) => void;
  onDismiss: (suggestionId: string) => void;
  setSuggestionState: SetState<SuggestionState>;
}

const DefaultSuggestionBody = ({
  suggestion,
  onAccept,
  onDismiss,
  setSuggestionState,
}: DefaultSuggestionBodyProps) => {
  return (
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
          <Tooltip title={"Edit the suggestion manually"}>
            <button
              className="rounded py-1 text-blue-400 transition-colors duration-300 hover:text-blue-700"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the parent onClick
                setSuggestionState(SuggestionState.Editing);
              }}
            >
              Edit
            </button>
          </Tooltip>
          <Tooltip title={"Ask AI to regenerate the suggestion"}>
            <button
              className="rounded py-1 text-blue-400 transition-colors duration-300 hover:text-blue-600"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the parent onClick
                setSuggestionState(SuggestionState.Regenerating);
              }}
            >
              Regenerate
            </button>
          </Tooltip>
        </>
      )}
      <button
        className="rounded py-1 text-gray-400 transition-colors duration-300 hover:text-gray-700"
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering the parent onClick
          onDismiss(suggestion.suggestionId);
        }}
      >
        Dismiss
      </button>
    </div>
  );
};

interface RegenerateSuggestionBodyProps {
  suggestion: Suggestion;
  onRegenerate: (suggestion: Suggestion, regenPrompt: string) => void; // New handler for regenerating
  setSuggestionState: SetState<SuggestionState>;
}

const RegenerateSuggestionBody = ({
  suggestion,
  onRegenerate,
  setSuggestionState,
}: RegenerateSuggestionBodyProps) => {
  const [regeneratePrompt, setRegeneratePrompt] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // Focus the textarea when it becomes visible
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [textareaRef.current]);

  const handleSubmitRegenerate = () => {
    onRegenerate(suggestion, regeneratePrompt);
    setSuggestionState(SuggestionState.Default);
  };

  const handleCancelRegenerate = () => {
    setSuggestionState(SuggestionState.Default);
  };

  return (
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
      <div className="mt-2 flex items-center space-x-2">
        <button
          className="rounded bg-green-600 px-4 py-1 text-white transition-colors duration-300 hover:bg-green-500"
          onClick={handleSubmitRegenerate}
        >
          Regenerate Suggestion
        </button>
        <button
          className="rounded px-4 py-1 text-gray-400 transition-colors duration-300 hover:text-gray-700"
          onClick={handleCancelRegenerate}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

interface EditSuggestionBodyProps {
  suggestion: Suggestion;
  onAccept: (acceptedOption: string) => void;
  setSuggestionState: SetState<SuggestionState>;
}

const EditSuggestionBody = ({
  suggestion,
  onAccept,
  setSuggestionState,
}: EditSuggestionBodyProps) => {
  const [newText, setNewText] = useState(suggestion.newText ?? "");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // Focus the textarea when it becomes visible
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [textareaRef.current]);

  const handleSubmitEdit = () => {
    onAccept(newText);
    setSuggestionState(SuggestionState.Default);
  };

  const handleCancelEdit = () => {
    setSuggestionState(SuggestionState.Default);
  };

  return (
    <div className="mt-4">
      <p className="text-sm text-slate-600">Original Text</p>
      <p className="mt-1">{suggestion.oldText}</p>
      <p className="mt-3 text-sm text-slate-600">Change into</p>
      <NormalTextArea
        ref={textareaRef}
        className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2"
        value={newText}
        onChange={(e) => setNewText(e.target.value)}
        minRows={3}
        placeholder="e.g. Use a different verb"
      />
      <div className="mt-2 flex items-center space-x-2">
        <button
          className="rounded bg-green-600 px-4 py-1 text-white transition-colors duration-300 hover:bg-green-500"
          onClick={handleSubmitEdit}
        >
          Apply Edits
        </button>
        <button
          className="rounded px-4 py-1 text-gray-400 transition-colors duration-300 hover:text-gray-700"
          onClick={handleCancelEdit}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

SuggestionComponent.displayName = "SuggestionComponent";

export default SuggestionComponent;
