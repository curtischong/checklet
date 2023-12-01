import React, { useRef, useState } from "react";
import { SuggestionsContainer } from "./suggestions/suggestionscontainer";
import { TextboxContainer } from "./textbox/textboxcontainer";
import {
    FeedbackTypeOrder,
    SuggestionRefs,
} from "./suggestions/suggestionsTypes";
import { EditorState } from "draft-js";
import { TextButton } from "@components/Button";
import { useRouter } from "next/router";
import { useClientContext } from "@utils/ClientContext";
import {
    CheckDescObj,
    CheckerStorefront,
} from "@components/create-checker/CheckerTypes";
import { Suggestion } from "@api/ApiTypes";

interface Props {
    storefront: CheckerStorefront;
}
export const Editor = ({ storefront }: Props): JSX.Element => {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [suggestionsRefs, setSuggestionsRefs] = useState<SuggestionRefs>({});
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

    const updateActiveSuggestion = (s: Suggestion | undefined) => {
        setActiveSuggestion(s);

        const selectionState = editorState.getSelection();

        setEditorState(EditorState.forceSelection(editorState, selectionState));
    };
    return (
        <div className="mx-auto max-w-screen-lg">
            <div className="grid grid-cols-5 gap-5 px-5">
                <TextboxContainer
                    activeSuggestion={activeSuggestion}
                    updateActiveSuggestion={updateActiveSuggestion}
                    suggestions={suggestions}
                    updateSuggestions={setSuggestions}
                    refs={suggestionsRefs}
                    updateRefs={setSuggestionsRefs}
                    editorState={editorState}
                    updateEditorState={setEditorState}
                    sort={sorts[sortIdx]}
                    editorRef={domEditorRef}
                    storefront={storefront}
                    setCheckDescObj={setCheckDescObj}
                    setHasAnalyzedOnce={setHasAnalyzedOnce}
                />
                <SuggestionsContainer
                    suggestions={suggestions}
                    refs={suggestionsRefs}
                    activeKey={activeSuggestion}
                    setActiveKey={updateActiveSuggestion}
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
