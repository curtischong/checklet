import React, { useState } from "react";
import { SuggestionsContainer } from "./suggestions/suggestionscontainer";
import { TextboxContainer } from "./textbox/textboxcontainer";
import { Suggestion } from "./suggestions/suggestionsTypes";

export const Content: React.FC = () => {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [suggestionsRefs, setSuggestionsRefs] = useState<{
        [key: string]: any;
    }>({});
    const [activeKey, setActiveKey] = useState("");
    return (
        <div className="mx-auto max-w-screen-lg">
            <div className="grid grid-cols-5 gap-5 px-5">
                <TextboxContainer
                    updateCollapseKey={setActiveKey}
                    suggestions={suggestions}
                    updateSuggestions={setSuggestions}
                    refs={suggestionsRefs}
                    updateRefs={setSuggestionsRefs}
                />
                <SuggestionsContainer
                    suggestions={suggestions}
                    refs={suggestionsRefs}
                    activeKey={activeKey}
                    setActiveKey={setActiveKey}
                />
            </div>
        </div>
    );
};
