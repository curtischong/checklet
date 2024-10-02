import { SuggestionChange } from "@/app/checker/[checkerId]/editor/suggestions/SuggestionChange";
import {
  CheckType,
  type Suggestion,
} from "@/app/checker/[checkerId]/editor/suggestions/suggestionsTypes";
import classNames from "classnames";
import { diffWords } from "diff";
import React, { useMemo } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  suggestion: Suggestion;
  activeSuggestion: Suggestion | undefined;
  onClick: () => void;
  onReplaceClick: (acceptedOption: string) => void;
  classNames?: string;
}

export const SuggestionCard = React.forwardRef((props: Props, ref) => {
  const { activeSuggestion, onClick, onReplaceClick, suggestion } = props;
  const isActive = useMemo(() => {
    if (activeSuggestion == null) {
      return false;
    }
    return JSON.stringify(suggestion) === JSON.stringify(activeSuggestion);
  }, [suggestion, activeSuggestion]);

  const diff = useMemo(() => {
    return diffWords(suggestion.oldText, suggestion.newText);
  }, [suggestion.oldText, suggestion.newText]);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={classNames(
        "max-w-[350px] bg-white shadow-around",
        {
          "mb-8 w-full animate-open rounded-lg p-4": isActive,
          "mb-5 flex w-full rounded-md p-4 opacity-100": !isActive,
        },
        props.classNames,
        {
          "cursor-pointer": !isActive,
        },
      )}
      onClick={() => {
        if (!isActive) {
          onClick();
        }
      }}
    >
      <div className={"flex overflow-hidden text-xs"}>
        {isActive ? (
          <div className="flex w-full cursor-pointer flex-row text-[#6e758b]">
            <div className="flex-grow" style={{ flexBasis: "0" }}>
              {suggestion.tipName}
            </div>
          </div>
        ) : (
          <div className="flex">
            <div className="flex-grow overflow-hidden overflow-ellipsis whitespace-nowrap">
              {diff.map((part, index) => {
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
        <div className={"px-[10px] py-[15px]"}>
          <div className={"flex pb-4 text-base"}>
            {/* Assuming SuggestionChange is modified similarly or adjusted accordingly */}
            <SuggestionChange
              suggestion={suggestion}
              checkType={CheckType.rephrase}
              onReplaceClick={onReplaceClick}
            />
          </div>
          <div className={`text-[13px]`}>
            <Markdown remarkPlugins={[remarkGfm]}>{suggestion.reason}</Markdown>
          </div>
        </div>
      )}
    </div>
  );
});

SuggestionCard.displayName = "SuggestionCard";
