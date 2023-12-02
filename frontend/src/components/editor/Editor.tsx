import React, { useRef, useState } from "react";
import { SuggestionsContainer } from "./suggestions/suggestionscontainer";
import { TextboxContainer } from "./textbox/textboxcontainer";
import { EditorState } from "draft-js";
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
    const [editorState, setEditorState] = useState<EditorState>(
        EditorState.createEmpty(),
    );
    const [checkDescObj, setCheckDescObj] = useState<CheckDescObj>({});
    const [sortIdx, setSortIdx] = useState(1);
    const [hasAnalyzedOnce, setHasAnalyzedOnce] = useState(false);
    const router = useRouter();
    const { user } = useClientContext();

    const sorts: ((a: Suggestion, b: Suggestion) => number)[] = [
        (a, b) => a.editOps[0].range.start - b.editOps[0].range.start,
        (a, b) => a.checkId.localeCompare(b.checkId), // this second sort is just to sort by checkId (so checks that are the same are next to each other)
    ];

    const updateSortIdx = (idx: number) => {
        setSortIdx(idx);
        setSuggestions((prevSuggestions) => prevSuggestions.sort(sorts[idx]));
    };
    const domEditorRef = useRef<{ focus: () => void }>();

    const updateEditorState = (newState: EditorState) => {
        const currentContentState = editorState.getCurrentContent();
        const newContentState = newState.getCurrentContent();
        const lastChange = newState.getLastChangeType();
        const getSelection = newState.getSelection();

        if (currentContentState !== newContentState) {
            // There was a change in the content
            // console.log("content changed");
            // console.log(newState.getCurrentContent().getPlainText());
            const { editedRange, numCharsAdded } = singleEditDistance(
                editorState.getCurrentContent().getPlainText(),
                newState.getCurrentContent().getPlainText(),
            );
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
        } else {
            // The change was triggered by a change in focus/selection
            console.log("focus changed");
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
                    updateEditorState={setEditorState}
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
