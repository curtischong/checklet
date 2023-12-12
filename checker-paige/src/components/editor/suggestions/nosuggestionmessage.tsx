import React from "react";
import { SuggestionMessage } from "./suggestionsTypes";

export const NoSuggestionMessage: React.FC<SuggestionMessage> = (
    suggestionMessage: SuggestionMessage,
) => {
    const { imageSrc, header, content } = suggestionMessage;

    return (
        <div className="flex flex-col items-center text-center m-auto pt-8">
            <img src={imageSrc} className="h-[18.75rem]" />
            <div className="font-bold py-2">{header}</div>
            <div className="flex flex-col items-center justify-center">
                {content}
            </div>
        </div>
    );
};
