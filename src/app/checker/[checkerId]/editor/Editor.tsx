"use client";
import { type CheckerStorefront } from "@/app/checker/[checkerId]/edit/CheckerTypes";
import { EditorHeader } from "@/app/checker/[checkerId]/editor/EditorHeader";
import { readEditorText } from "@/app/checker/[checkerId]/editor/localstorage";
import { singleEditDistance } from "@/app/checker/[checkerId]/editor/singleEditDistance";
import {
  Sorters,
  SortType,
  SuggestionsContainer,
} from "@/app/checker/[checkerId]/editor/suggestions/suggestionscontainer";
import {
  hashSuggestion,
  isBefore,
  isIntersecting,
  shift,
  type Suggestion,
} from "@/app/checker/[checkerId]/editor/suggestions/suggestionsTypes";
import { apiClient, handleErr } from "@/trpc/react";
import { type SetState } from "@/utils/types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { type RichTextareaHandle } from "rich-textarea";
import { TextboxContainer } from "./textboxcontainer";

interface Props {
  checkerStorefront: CheckerStorefront;
  editorState: string;
  setEditorState: SetState<string>;
  isFocusedOnStart: boolean;
  isSavingToLocalStorage: boolean;
}
export const Editor = ({
  checkerStorefront,
  editorState,
  setEditorState,
  isFocusedOnStart,
  isSavingToLocalStorage,
}: Props): JSX.Element => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState<Suggestion>();
  const [hasModifiedTextAfterChecking, setHasModifiedTextAfterChecking] =
    useState(true); // init as true so when ppl first enter the page, they see "ready to check?"
  const [isLoading, setIsLoading] = React.useState(false);
  const editorRef = useRef<RichTextareaHandle | null>(null);
  const acceptedSuggestionIdsRef = useRef(new Set<string>());
  const dismissedSuggestionHashes = useRef(new Set<number>());
  const [sortType, setSortType] = useState(SortType.TextOrder);

  // so when ppl copy and paste the url, they get a descripton of what the checker is
  useEffect(() => {
    // do NOT use router.push because it'll reload the page. Also. Chrome will try to find the "Checker" word in the page and
    // center the page to that location - meaning the page won't start at the top of the page
    // https://stackoverflow.com/questions/2305069/can-you-use-hash-navigation-without-affecting-history
    const url = `${window.location.pathname}${window.location.search}#${checkerStorefront.name.replaceAll(" ", "-")}`;
    window.history.replaceState(null, "", url);
  }, [checkerStorefront]);

  useEffect(() => {
    if (isFocusedOnStart) {
      editorRef?.current?.focus();
    }
  }, [isFocusedOnStart]);

  useEffect(() => {
    // only load the localStorage data if we're saving to it
    if (isSavingToLocalStorage) {
      const prevDocument = readEditorText(checkerStorefront.checkerId);
      if (prevDocument) {
        setEditorState(prevDocument);
      }
    }
    // not sure why updateEditorState keeps changing. but it does. But we only want this useEffect to run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSavingToLocalStorage]);

  const updateEditorState = useCallback(
    (oldText: string, newText: string, curSuggestions: Suggestion[]) => {
      // if the text changed, we need to shift all the suggestions.
      if (oldText !== newText) {
        // PERF: look into rich-textarea to see if we can get the diff of the text change so it's O(1) instead of O(n)
        // 1) calculate WHERE the text changed (and how many chars changed)
        const { editedRange, numCharsAdded } = singleEditDistance(
          oldText,
          newText,
        );

        // 2) remove all suggestions that have been accepted (read acceptSuggestion to understand why we're using acceptedSuggestionIdsRef)
        let filteredSuggestions;
        if (acceptedSuggestionIdsRef.current.size === 0) {
          filteredSuggestions = curSuggestions;
        } else {
          filteredSuggestions = curSuggestions.filter(
            (s) => !acceptedSuggestionIdsRef.current.has(s.suggestionId),
          );
          acceptedSuggestionIdsRef.current.clear();
        }

        // 3) shift all the suggestions. Note: if the text changed WITHIN a suggestion, that suggestion is now invalid. so we remove it
        const newSuggestions = [];
        for (const suggestion of filteredSuggestions) {
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

      // how come we are not simply removing the suggestion from the suggestions list?
      // This is because this edit will shift all the other suggestions. so we need to use updateEditorState
      // to update the indexes of all the other suggestions. So to properly invalidate this suggestion,
      // we'll add it to the acceptedSuggestionIdsRef set and manually filter it out inside updateEditorState
      acceptedSuggestionIdsRef.current.add(suggestion.suggestionId);

      editorRef.current.focus({ preventScroll: true });
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

  const checkDocument = useCallback(
    (checkerId: string, editorState: string): void => {
      if (isLoading) {
        return;
      }
      setIsLoading(true);
      handleErr(
        apiClient.checker.checkDoc.mutate({
          doc: editorState,
          checkerId: checkerId,
        }),
        (response) => {
          setIsLoading(false);
          if (!response) {
            toast.error(
              "Something went wrong, please let Curtis know on Discord!",
            );
            return;
          }
          setHasModifiedTextAfterChecking(false);

          const newSuggestions = response.suggestions;

          // only show suggestions the user didn't dismiss. obv if they refresh the page this set isn't persisted. but it's okay!
          const filteredSuggestions = newSuggestions.filter(
            (suggestion) =>
              !dismissedSuggestionHashes.current.has(
                hashSuggestion(suggestion),
              ),
          );

          filteredSuggestions.sort(Sorters[sortType]);
          setSuggestions(filteredSuggestions);
        },
        () => {
          setIsLoading(false);
        },
      );
    },
    [
      isLoading,
      setHasModifiedTextAfterChecking,
      setIsLoading,
      setSuggestions,
      sortType,
    ],
  );

  return (
    <div className="mx-auto flex h-full w-full flex-row">
      <div
        className="textbox w-[70%]"
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          marginTop: "30px",
        }}
      >
        <div
          className="flex-0"
          style={{
            flexGrow: 0,
            flexBasis: "auto",
          }}
        >
          <EditorHeader
            storefront={checkerStorefront}
            editorState={editorState}
            onTryWithSampleDoc={() => {
              // DO NOT just call setEditorState so the user can undo this action with ctrl + z
              if (!editorRef.current) {
                return;
              }
              // do NOT return early. we want the user's cursor to jump to the end so it feels like clicking the button did something
              // if (editorState === storefront.sampleDoc) {
              //   return;
              // }

              // clear the entire editor and insert the sample doc
              editorRef.current.focus();
              editorRef.current.setSelectionRange(
                0,
                editorRef.current.value.length,
              );
              // this is deprecated but it works!
              document.execCommand(
                "insertText",
                false,
                checkerStorefront.sampleDoc,
              );

              // wait for the editor to update
              checkDocument(
                checkerStorefront.checkerId,
                checkerStorefront.sampleDoc, // we're doing something really smart here. since we know what the doc is, we can just pass it in (don't need for state to update)
              );
            }}
          />
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
              setHasModifiedTextAfterChecking(newText !== "");
              updateEditorState(editorState, newText, suggestions);
            }}
            isLoading={isLoading}
            editorRef={editorRef}
            isSavingToLocalStorage={isSavingToLocalStorage}
          />
        </div>
      </div>
      {/* don't wrap this container in a div. style it by adding styles to the div inside SuggestionsContainer */}
      <SuggestionsContainer
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
        sortType={sortType}
        setSortType={setSortType}
        dismissedSuggestionHashes={dismissedSuggestionHashes}
        checkDocument={checkDocument}
      />
    </div>
  );
};
