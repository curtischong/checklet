import React from "react";
import css from "./nosuggestionmessage.module.scss";
import { SuggestionMessage } from "./suggestionsTypes";

export const NoSuggestionMessage: React.FC<SuggestionMessage> = (
    suggestionMessage: SuggestionMessage,
) => {
    const { imageSrc, header, content } = suggestionMessage;

    return (
        <div className={css.container}>
            <img src={imageSrc} className={css.image} />
            <div className={css.header}>{header}</div>
            <div className={css.content}>{content}</div>
        </div>
    );
};
