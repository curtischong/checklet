import { useEffect, useRef } from "react";

export type ITextArea = React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
>;

export const TextArea: React.FC<ITextArea> = ({
    className = "",
    children,
    ...rest
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const MIN_HEIGHT = 100;
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
            className={`bg-white p-1 my-1 text-gray-600 border border-[#5384d4] py-2 px-4 rounded resize-none ${className}`}
            {...rest}
            ref={textareaRef}
        >
            {children}
        </textarea>
    );
};
