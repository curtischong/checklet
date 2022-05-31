import React from "react";

type TextboxProps = {
    header: string;
    text: string;
    updateText: (s: string) => void;
};

export const Textbox: React.FC<TextboxProps> = (props: TextboxProps) => {
    const { header, text, updateText } = props;

    return (
        <div className="grid">
            {header}
            <textarea
                value={text}
                onChange={(t) => updateText(t.target.value)}
                style={{ width: "400px", height: "400px" }}
                className="resize border rounded focus:outline-none focus:shadow-outline"
            />
        </div>
    );
};
