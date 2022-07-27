import React, { useEffect, useRef, useState } from "react";
import { SuggestionsContainer } from "./suggestions/suggestionscontainer";
import { TextboxContainer } from "./textbox/textboxcontainer";
import { Suggestion, SuggestionRefs } from "./suggestions/suggestionsTypes";
import { EditorState } from "draft-js";

export const Content: React.FC = () => {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [suggestionsRefs, setSuggestionsRefs] = useState<SuggestionRefs>({});
    const [activeKey, setActiveKey] = useState<Suggestion>();
    const [editorState, setEditorState] = useState<EditorState>(
        EditorState.createEmpty(),
    );
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
                    editorRef={domEditorRef}
                />
                <SuggestionsContainer
                    suggestions={suggestions}
                    refs={suggestionsRefs}
                    activeKey={activeKey}
                    setActiveKey={updateActiveKey}
                    editorState={editorState}
                    updateEditorState={setEditorState}
                />
            </div>
        </div>
    );
};
