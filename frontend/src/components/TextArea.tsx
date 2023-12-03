import classNames from "classnames";
import { useEffect, useRef } from "react";

export type ITextArea = React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
        minHeight?: number;
    },
    HTMLTextAreaElement
>;

export const TextArea: React.FC<ITextArea> = ({
    className = "",
    children,
    minHeight,
    ...rest
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const MIN_HEIGHT = minHeight ?? 120;
    console.log(MIN_HEIGHT);
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height =
                Math.max(textareaRef.current.scrollHeight + 20, MIN_HEIGHT) +
                "px";
        }
    }, [rest.value]);
    return (
        <textarea
            className={classNames(
                `bg-white p-1 my-1 text-gray-600 border border-gray-400 py-2 px-4 rounded resize-none`,
                className,
                {
                    "cursor-not-allowed bg-[#f1f1f1]": rest.disabled,
                },
            )}
            {...rest}
            ref={textareaRef}
        >
            {children}
        </textarea>
    );
};
