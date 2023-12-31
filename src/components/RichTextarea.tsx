import { useState } from "react";
import { RichTextarea } from "rich-textarea";

// this is a demo file of richtextarea. it's not used in the app
// we can use it to test how richtextarea works
// https://github.com/inokawa/rich-textarea/tree/main

export const RichTextareaCore = (): JSX.Element => {
    const [text, setText] = useState("Lorem ipsum");
    const ranges = [
        { start: 2, end: 5, color: "red" },
        { start: 10, end: 11, color: "green" },
        { start: 14, end: 17, color: "blue" },
    ];

    return (
        <RichTextarea
            value={text}
            style={{ width: "600px", height: "400px" }}
            onChange={(e) => setText(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
        >
            {(v) => {
                const res: JSX.Element[] = [];
                let lastCharIdx = 0;
                for (const range of ranges) {
                    if (lastCharIdx < range.start) {
                        res.push(
                            <span>
                                {v.substring(lastCharIdx, range.start)}
                            </span>,
                        );
                    }

                    res.push(
                        <span className="cursor-pointer py-[1px]  border-b-[2px] border-blue-500">
                            {v.substring(range.start, range.end)}
                        </span>,
                    );
                    lastCharIdx = range.end;
                }
                if (lastCharIdx < v.length) {
                    res.push(<span>{v.substring(lastCharIdx)}</span>);
                }
                return res;
            }}
        </RichTextarea>
    );
};
