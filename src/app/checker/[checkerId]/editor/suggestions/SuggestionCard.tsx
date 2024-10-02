import { SuggestionChange } from "@/app/checker/[checkerId]/editor/suggestions/SuggestionChange";
import {
  CheckType,
  type Suggestion,
} from "@/app/checker/[checkerId]/editor/suggestions/suggestionsTypes";
import { default as classNames, default as classnames } from "classnames";
import React, { useMemo } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
// https://github.com/remarkjs/react-markdown/tree/website

interface Props {
  suggestion: Suggestion;
  activeSuggestion: Suggestion | undefined;
  onClick: () => void;
  onReplaceClick: (acceptedOption: string) => void;
  //   checkDescObj: CheckDescObj;
  classNames?: string;
  // ref: React.RefObject<HTMLDivElement>;
}

const isEqual = (...objects: Suggestion[]) =>
  objects.every((obj) => JSON.stringify(obj) === JSON.stringify(objects[0]));

export const SuggestionCard = React.forwardRef((props: Props, ref) => {
  const { activeSuggestion, onClick, onReplaceClick, suggestion } = props;
  const isActive = useMemo(() => {
    if (activeSuggestion == null) {
      return false;
    }
    return isEqual(suggestion, activeSuggestion);
  }, [suggestion, activeSuggestion]);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={classnames(
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
      <div className={"flex overflow-hidden text-xs"} onClick={onClick}>
        {isActive ? (
          <div
            className={classNames(
              "flex w-full cursor-pointer flex-row text-[#6e758b]",
            )}
          >
            <div
              className="flex-grow"
              style={{
                flexBasis: "0",
              }}
            >
              {suggestion.tipName}
            </div>
          </div>
        ) : (
          <>
            <div
              className={
                "max-w-[40%] overflow-hidden overflow-ellipsis whitespace-nowrap"
              }
            >
              {suggestion.oldText}
            </div>
            <span className={"mx-2 my-auto h-1 w-1 rounded-full bg-red-600"} />
            <div className={"overflow-hidden font-normal text-gray-600"}>
              {suggestion.tipName}
            </div>
          </>
        )}
      </div>
      {/* This is the card details when you open up the card */}
      {isActive && (
        <div className={"px-[10px] py-[15px]"}>
          <div className={"flex pb-4 text-base"}>
            <SuggestionChange
              suggestion={suggestion}
              checkType={CheckType.rephrase}
              onReplaceClick={onReplaceClick}
            />
          </div>
          <div className={`text-[13px]`}>
            {" "}
            <Markdown
              // className="whitespace-pre"
              remarkPlugins={[remarkGfm]}
              // remarkPlugins={[remarkGfm]}
            >
              {suggestion.reason}
            </Markdown>
          </div>
        </div>
      )}
    </div>
  );
});

SuggestionCard.displayName = "SuggestionCard";
