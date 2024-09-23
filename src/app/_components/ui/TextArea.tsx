import classNames from "classnames";
import { useRef } from "react";

import React from "react";

import { useEffect, type TextareaHTMLAttributes } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  autoSize?: boolean;
  maxRows?: number; // Control max rows before showing a scrollbar
}

const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  className = "",
  autoSize = false,
  maxRows = 300, // Default maxRows (slightly increased from previous)
  rows = 4, // Increased default height
  ...rest
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const resizeTextArea = () => {
    if (textAreaRef.current && autoSize) {
      textAreaRef.current.style.height = "auto"; // Reset height to shrink if needed
      textAreaRef.current.style.overflow = "hidden"; // Ensure no scrollbar appears when resizing
      const scrollHeight = textAreaRef.current.scrollHeight;
      const lineHeight = parseFloat(
        getComputedStyle(textAreaRef.current).lineHeight || "20",
      );
      const maxHeight = lineHeight * maxRows;

      if (scrollHeight > maxHeight) {
        textAreaRef.current.style.height = `${maxHeight}px`;
        textAreaRef.current.style.overflow = "auto"; // Show scrollbar if content exceeds maxHeight
      } else {
        textAreaRef.current.style.height = `${scrollHeight}px`;
      }
    }
  };

  useEffect(() => {
    resizeTextArea(); // Adjust size on initial render and when value changes
  }, [value]);

  return (
    <textarea
      ref={textAreaRef}
      className={classNames(
        "w-full rounded-md border border-gray-300 p-2",
        "focus-visible:border-blue-300 focus-visible:ring-[1px] focus-visible:ring-blue-300",
        "focus:outline-none", // Remove default outline for clicks
        "focus:ring-[1px] focus:ring-blue-300", // Lighter and thinner outline on click
        "focus:border-blue-300", // Lighter border on click
        className,
      )}
      value={value}
      onChange={(e) => {
        if (onChange) {
          onChange(e);
        }
        resizeTextArea(); // Adjust size dynamically
      }}
      rows={rows} // Default taller textarea
      {...rest}
    />
  );
};

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
        `my-1 resize-none rounded border border-gray-400 bg-white p-1 px-4 py-2 text-gray-600`,
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
