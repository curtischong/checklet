import React, { useState } from "react";
import { SuggestionsContainer } from "./suggestions/suggestionscontainer";
import { TextboxContainer } from "./textbox/textboxcontainer";
import { SuggestionCategory } from "./suggestions/suggestionsTypes";

export const Content: React.FC = () => {
    const [suggestions, setSuggestions] = useState<SuggestionCategory[]>([]);
    return (
        <div className="mx-auto max-w-screen-lg">
            <div className="grid grid-cols-5 gap-20 p-5">
                <TextboxContainer
                    suggestions={suggestions}
                    updateSuggestions={setSuggestions}
                />
                <SuggestionsContainer suggestions={suggestions} />
            </div>
        </div>
    );
};
