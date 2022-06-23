import React from "react";
import { SuggestionsContainer } from "./suggestions/suggestionscontainer";
import { TextboxContainer } from "./textbox/textboxcontainer";

export const Content: React.FC = () => {
    return (
        <div className="mx-auto max-w-screen-lg">
            <div className="grid grid-cols-5 gap-20 p-5">
                <TextboxContainer />
                <SuggestionsContainer />
            </div>
        </div>
    );
};
