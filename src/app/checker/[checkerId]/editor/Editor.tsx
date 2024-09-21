import { type CheckerStorefront } from "@/app/checker/[checkerId]/edit/CheckerTypes";
import { EditorHeader } from "@/app/checker/[checkerId]/editor/EditorHeader";
import { singleEditDistance } from "@/app/checker/[checkerId]/editor/singleEditDistance";
import { SuggestionsContainer } from "@/app/checker/[checkerId]/editor/suggestions/suggestionscontainer";
import {
  isBefore,
  isIntersecting,
  shift,
  type Suggestion,
} from "@/app/checker/[checkerId]/editor/suggestions/suggestionsTypes";
import React, { useCallback, useRef, useState } from "react";
import { type RichTextareaHandle } from "rich-textarea";
import { TextboxContainer } from "./textboxcontainer";

interface Props {
  checkerStorefront: CheckerStorefront;
}
export const Editor = ({ checkerStorefront }: Props): JSX.Element => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState<Suggestion>();
  const [editorState, setEditorState] = useState<string>("");
  const [hasModifiedTextAfterChecking, setHasModifiedTextAfterChecking] =
    useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const editorRef = useRef<RichTextareaHandle | null>(null);

  const updateEditorState = useCallback(
    (oldText: string, newText: string, curSuggestions: Suggestion[]) => {
      console.log(oldText, newText);
      // if the text changed, we need to shift all the suggestions.
      if (oldText !== newText) {
        // PERF: look into rich-textarea to see if we can get the diff of the text change so it's O(1) instead of O(n)
        // 1) calculate WHERE the text changed (and how many chars changed)
        const { editedRange, numCharsAdded } = singleEditDistance(
          oldText,
          newText,
        );
        // 2) shift all the suggestions. Note: if the text changed WITHIN a suggestion, that suggestion is now invalid. so we remove it
        const newSuggestions = [];
        for (const suggestion of curSuggestions) {
          if (isBefore(suggestion.range, editedRange)) {
            newSuggestions.push({ ...suggestion });
          } else if (isIntersecting(suggestion.range, editedRange)) {
            // console.log(suggestion.range, editedRange);

            // due to the way we calculate diffs, the editedRange will overlap with the suggestion range
            // these if statements handle handles these edge cases so we properly update the suggestion range
            if (
              numCharsAdded > 0 && // they added text at the beginning of the suggestion
              editedRange.start === suggestion.range.start &&
              editedRange.end === editedRange.start + 1
            ) {
              newSuggestions.push({
                ...suggestion,
                range: shift(suggestion.range, numCharsAdded),
              });
            } else if (
              numCharsAdded < 0 && // they rmeoved text at the beginning of the suggestion
              editedRange.end === suggestion.range.start + 1
            ) {
              newSuggestions.push({
                ...suggestion,
                range: shift(suggestion.range, numCharsAdded),
              });
            }

            // if they modified characters afterwards, there is no overlap! so we don't need to handle that case
            // otherwise, they modified characters WITHIN the suggestion, so do nothing since the suggestion is now invalid
          } else {
            newSuggestions.push({
              ...suggestion,
              range: shift(suggestion.range, numCharsAdded),
            });
          }
        }
        setSuggestions(newSuggestions);
      }
      setEditorState(newText);
    },
    [setEditorState, setSuggestions],
  );

  const acceptSuggestion = useCallback(
    (suggestion: Suggestion, acceptedOption: string) => {
      if (!editorRef.current) {
        console.error("editor ref not found. cannot accept suggestion");
        return;
      }

      editorRef.current.focus();
      editorRef.current.setSelectionRange(
        suggestion.range.start,
        suggestion.range.end,
      );
      // execCommand is deprecated but it works!
      document.execCommand("insertText", false, acceptedOption);

      // the below code works, but the user cannot undo the change. Keeping it here for reference though
      //
      // the user did a replacement. We should set it to true cause the text was modified!
      // if we don't, and if all suggestions are resolved, we'll show the "no suggestions generated" img
      // (however, the replacement COULD trigger more suggestions. So we must set this to false to prevent the possibly misleading img from appearing)
      // setHasModifiedTextAfterChecking(true);
      // updateEditorState(editorState, newText, suggestions);
    },
    [],
  );

  return (
    <div className="mx-auto w-full max-w-screen-xl">
      <div className="flex flex-row space-x-10 px-5">
        <div
          className="textbox"
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            flexGrow: 1,
          }}
        >
          <div
            className="flex-0"
            style={{
              flexGrow: 0,
              flexBasis: "auto",
            }}
          >
            <EditorHeader storefront={checkerStorefront} />
          </div>
          <div
            className="flex-1"
            style={{
              flexGrow: 1,
              flexBasis: "auto",
            }}
          >
            <TextboxContainer
              storefront={checkerStorefront}
              activeSuggestion={activeSuggestion}
              updateActiveSuggestion={setActiveSuggestion}
              suggestions={suggestions}
              editorState={editorState}
              updateEditorState={(newText) => {
                console.log("updateEditorState");
                setHasModifiedTextAfterChecking(newText !== "");
                updateEditorState(editorState, newText, suggestions);
              }}
              isLoading={isLoading}
              editorRef={editorRef}
            />
          </div>
        </div>
        <div
          style={{
            flexBasis: 2,
          }}
        >
          <SuggestionsContainer
            setHasModifiedTextAfterChecking={setHasModifiedTextAfterChecking}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setSuggestions={setSuggestions}
            suggestions={suggestions}
            activeSuggestion={activeSuggestion}
            setActiveSuggestion={setActiveSuggestion}
            editorState={editorState}
            acceptSuggestion={acceptSuggestion}
            hasModifiedTextAfterChecking={hasModifiedTextAfterChecking}
            storefront={checkerStorefront}
          />
        </div>
      </div>
    </div>
  );
};
