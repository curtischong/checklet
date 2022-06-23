import { Input } from "antd";
import React from "react";
import css from "./textbox.module.scss";

const { TextArea } = Input;

type TextboxProps = {
    text: string;
    updateText: (s: string) => void;
};

export const Textbox: React.FC<TextboxProps> = (props: TextboxProps) => {
    const { text, updateText } = props;

    return (
        <TextArea
            placeholder="Type/paste resume points here"
            autoSize={{ minRows: 15 }}
            bordered={true}
            className={css.textbox}
            value={text}
            onChange={(t) => updateText(t.target.value)}
        />
    );
};
