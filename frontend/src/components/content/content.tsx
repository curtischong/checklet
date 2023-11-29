import React, { useRef, useState } from "react";
import { SuggestionsContainer } from "./suggestions/suggestionscontainer";
import { TextboxContainer } from "./textbox/textboxcontainer";
import {
    FeedbackTypeOrder,
    Suggestion,
    SuggestionRefs,
} from "./suggestions/suggestionsTypes";
import { EditorState } from "draft-js";
import { TextButton } from "@components/Button";
import { useRouter } from "next/router";

export const Content: React.FC = () => {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [suggestionsRefs, setSuggestionsRefs] = useState<SuggestionRefs>({});
    const [activeKey, setActiveKey] = useState<Suggestion>();
    const [editorState, setEditorState] = useState<EditorState>(
        EditorState.createEmpty(),
    );
    const [sortIdx, setSortIdx] = useState(1);
    const router = useRouter();

    const sorts: ((a: Suggestion, b: Suggestion) => number)[] = [
        (a, b) => a.highlightRanges[0].startPos - b.highlightRanges[0].startPos,
        (a, b) =>
            FeedbackTypeOrder[a.feedbackType] -
            FeedbackTypeOrder[b.feedbackType],
    ];

    const updateSortIdx = (idx: number) => {
        setSortIdx(idx);
        setSuggestions((prevSuggestions) => prevSuggestions.sort(sorts[idx]));
    };
    const domEditorRef = useRef<{ focus: () => void }>();

    const updateActiveKey = (s: Suggestion | undefined) => {
        setActiveKey(s);

        const selectionState = editorState.getSelection();

        setEditorState(EditorState.forceSelection(editorState, selectionState));
    };

    return (
        <div className="mx-auto max-w-screen-lg">
            <div className="grid grid-cols-5 gap-5 px-5">
                <TextboxContainer
                    activeKey={activeKey}
                    updateCollapseKey={updateActiveKey}
                    suggestions={suggestions}
                    updateSuggestions={setSuggestions}
                    refs={suggestionsRefs}
                    updateRefs={setSuggestionsRefs}
                    editorState={editorState}
                    updateEditorState={setEditorState}
                    sort={sorts[sortIdx]}
                    editorRef={domEditorRef}
                />
                <SuggestionsContainer
                    suggestions={suggestions}
                    refs={suggestionsRefs}
                    activeKey={activeKey}
                    setActiveKey={updateActiveKey}
                    editorState={editorState}
                    updateEditorState={setEditorState}
                    updateSortIdx={updateSortIdx}
                />
                <TextButton
                    className="fixed top-2 right-5"
                    onClick={() => {
                        router.push("/dashboard");
                    }}
                >
                    Create Your Own Checker
                </TextButton>
            </div>
        </div>
    );
};
