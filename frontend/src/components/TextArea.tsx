import TextArea from "antd/lib/input/TextArea";
import classNames from "classnames";
import { useRef } from "react";

export type ITextArea = React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
        minRows?: number;
    },
    HTMLTextAreaElement
>;

export const NormalTextArea: React.FC<ITextArea> = ({
    className = "",
    children,
    minRows,
    ...rest
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { onResize, ...otherProps } = rest;
    return (
        <TextArea
            className={classNames(
                `bg-white p-1 my-1 text-gray-600 border border-gray-400 py-2 px-4 rounded resize-none`,
                className,
                {
                    "cursor-not-allowed bg-[#f1f1f1]": rest.disabled,
                },
            )}
            {...otherProps}
            ref={textareaRef}
            autoSize={
                minRows
                    ? {
                          minRows,
                      }
                    : true
            }
        >
            {children}
        </TextArea>
    );
};
