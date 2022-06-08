import React from "react";

type TextboxProps = {
    header: string;
    text: string;
    updateText?: (s: string) => void;
    boxSize?: number;
};

export const Textbox: React.FC<TextboxProps> = (props: TextboxProps) => {
    const { header, text, updateText, boxSize } = props;

    return (
        <div className="grid">
            <div className="font-bold pb-5">{header}</div>
            <textarea
                value={text}
                onChange={(t) => updateText && updateText(t.target.value)}
                style={{ width: boxSize ?? 400, height: boxSize ?? 400 }}
                className="resize border rounded focus:outline-none focus:shadow-outline"
            />
        </div>
    );
};
