import React, { useCallback, useEffect, useRef, useState } from "react";
import { SuggestionsContainer } from "./suggestions/suggestionscontainer";
import { TextboxContainer } from "./textbox/textboxcontainer";
import { TextButton } from "@components/Button";
import { useRouter } from "next/router";
import { useClientContext } from "@utils/ClientContext";
import {
    CheckDescObj,
    CheckerStorefront,
} from "@components/create-checker/CheckerTypes";
import { Suggestion, isBefore, isIntersecting, shift } from "@api/ApiTypes";
import { singleEditDistance } from "@components/editor/singleEditDistance";
import { EditorHeader } from "@components/editor/EditorHeader";

interface Props {
    storefront: CheckerStorefront;
}
export const Editor = ({ storefront }: Props): JSX.Element => {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [activeSuggestion, setActiveSuggestion] = useState<Suggestion>();
    const [editorState, setEditorState] = useState<string>("");
    const [checkDescObj, setCheckDescObj] = useState<CheckDescObj>({});
    const [hasModifiedTextAfterChecking, setHasModifiedTextAfterChecking] =
        useState(false);
    const router = useRouter();
    const { user } = useClientContext();
    const [isLoading, setIsLoading] = React.useState(false);
    const editorRef = useRef<RichTextareaHandle | null>(null);

    const updateEditorState = useCallback(
        (oldText: string, newText: string, curSuggestions: Suggestion[]) => {
            // if the text changed, we need to shift all the suggestions.
            if (oldText !== newText) {
                // console.log("text changed");
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

    // const newEditorState =
    // editorState.slice(0, s.range.start) +
    // s.editedText +
    // editorState.slice(s.range.end);
    const acceptSuggestion = useCallback(
        (suggestion: Suggestion, acceptedOption: string) => {
            if (!editorRef) {
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
        <div className="mx-auto max-w-screen-lg">
            <div className="grid grid-cols-5 gap-5 px-5">
                <div
                    className="textbox col-span-3"
                    style={{
                        maxHeight: "100vh",
                        overflow: "auto",
                    }}
                >
                    <EditorHeader
                        isLoading={isLoading}
                        editorState={editorState}
                        setHasModifiedTextAfterChecking={
                            setHasModifiedTextAfterChecking
                        }
                        setSuggestions={setSuggestions}
                        storefront={storefront}
                        setIsLoading={setIsLoading}
                        setCheckDescObj={setCheckDescObj}
                    />
                    <TextboxContainer
                        activeSuggestion={activeSuggestion}
                        updateActiveSuggestion={setActiveSuggestion}
                        suggestions={suggestions}
                        editorState={editorState}
                        updateEditorState={(newText) => {
                            setHasModifiedTextAfterChecking(newText !== "");
                            updateEditorState(
                                editorState,
                                newText,
                                suggestions,
                            );
                        }}
                        isLoading={isLoading}
                        editorRef={editorRef}
                    />
                </div>
                <SuggestionsContainer
                    suggestions={suggestions}
                    activeSuggestion={activeSuggestion}
                    setActiveSuggestion={setActiveSuggestion}
                    editorState={editorState}
                    acceptSuggestion={acceptSuggestion}
                    checkDescObj={checkDescObj}
                    hasModifiedTextAfterChecking={hasModifiedTextAfterChecking}
                />
                <TextButton
                    className="fixed top-2 right-5"
                    onClick={() => {
                        const isLoggedOut = user === null;
                        if (isLoggedOut) {
                            router.push("/login");
                        } else {
                            router.push("/dashboard");
                        }
                    }}
                >
                    Create Your Own Checker
                </TextButton>
            </div>
        </div>
    );
};
