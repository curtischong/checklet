import React, { useRef, useState } from "react";
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

interface Props {
    storefront: CheckerStorefront;
}
export const Editor = ({ storefront }: Props): JSX.Element => {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [activeSuggestion, setActiveSuggestion] = useState<Suggestion>();
    const [editorState, setEditorState] = useState<string>("");
    const [checkDescObj, setCheckDescObj] = useState<CheckDescObj>({});
    const [sortIdx, setSortIdx] = useState(1);
    const [hasAnalyzedOnce, setHasAnalyzedOnce] = useState(false);
    const router = useRouter();
    const { user } = useClientContext();

    const sorts: ((a: Suggestion, b: Suggestion) => number)[] = [
        (a, b) => a.range.start - b.range.start, // sort by order of appearance
        (a, b) => a.checkId.localeCompare(b.checkId), // this second sort is just to sort by checkId (so checks that are the same are next to each other)
    ];

    const updateSortIdx = (idx: number) => {
        setSortIdx(idx);
        setSuggestions((prevSuggestions) => prevSuggestions.sort(sorts[idx]));
    };
    const domEditorRef = useRef<{ focus: () => void }>();

    const updateEditorState = (newState: string) => {
        const oldContent = editorState;
        const newContent = newState;
        // const lastChange = newState.getLastChangeType(); // please leave this line here for documentation

        // if the text changed, we need to shift all the suggestions.
        // console.log("oldText", oldText);
        // console.log("newText", newText);
        if (oldContent !== newContent) {
            // console.log("text changed");
            // PERF: look into rich-textarea to see if we can get the diff of the text change so it's O(1) instead of O(n)
            // 1) calculate WHERE the text changed (and how many chars changed)
            const { editedRange, numCharsAdded } = singleEditDistance(
                oldContent,
                newContent,
            );

            // 2) shift all the suggestions. Note: if the text changed WITHIN a suggestion, that suggestion is now invalid. so we remove it
            const newSuggestions = [];
            for (const suggestion of suggestions) {
                if (isBefore(suggestion.range, editedRange)) {
                    newSuggestions.push({ ...suggestion });
                } else if (isIntersecting(suggestion.range, editedRange)) {
                    // do nothing since the suggestion is now invalid
                } else {
                    newSuggestions.push({
                        ...suggestion,
                        range: shift(suggestion.range, numCharsAdded),
                    });
                }
            }
            setSuggestions(newSuggestions);
        }
        setEditorState(newState);
    };

    return (
        <div className="mx-auto max-w-screen-lg">
            <div className="grid grid-cols-5 gap-5 px-5">
                <TextboxContainer
                    activeSuggestion={activeSuggestion}
                    updateActiveSuggestion={setActiveSuggestion}
                    suggestions={suggestions}
                    updateSuggestions={setSuggestions}
                    editorState={editorState}
                    updateEditorState={updateEditorState}
                    sort={sorts[sortIdx]}
                    editorRef={domEditorRef}
                    storefront={storefront}
                    setCheckDescObj={setCheckDescObj}
                    setHasAnalyzedOnce={setHasAnalyzedOnce}
                />
                <SuggestionsContainer
                    suggestions={suggestions}
                    activeSuggestion={activeSuggestion}
                    setActiveSuggestion={setActiveSuggestion}
                    editorState={editorState}
                    updateEditorState={updateEditorState}
                    updateSortIdx={updateSortIdx}
                    checkDescObj={checkDescObj}
                    hasAnalyzedOnce={hasAnalyzedOnce}
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
