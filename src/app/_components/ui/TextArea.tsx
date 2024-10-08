import { useScroll } from "@/app/ScrollProvider";
import classNames from "classnames";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type TextareaHTMLAttributes,
} from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  autoSize?: boolean;
  maxRows?: number; // Control max rows before showing a scrollbar
  minRows?: number;
}

export const NormalTextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      value,
      onChange,
      className = "",
      autoSize = true,
      maxRows = 300,
      minRows = 4,
      ...rest
    },
    ref,
  ) => {
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    const { scrollPositionRef } = useScroll();

    // Expose the internal ref to the parent component
    useImperativeHandle(ref, () => textAreaRef.current!);

    useEffect(() => {
      const textarea = textAreaRef.current;

      if (textarea && autoSize) {
        // Reset height to calculate the new height
        textarea.style.height = "auto";

        // Calculate the new height based on scrollHeight
        const scrollHeight = textarea.scrollHeight;

        // Get the line height for accurate maxHeight calculation
        const lineHeight = parseFloat(
          getComputedStyle(textarea).lineHeight || "20",
        );
        const computedMaxHeight = lineHeight * maxRows;

        if (scrollHeight > computedMaxHeight) {
          textarea.style.height = `${computedMaxHeight}px`;
          textarea.style.overflow = "auto"; // Enable internal scrollbar
        } else {
          textarea.style.height = `${scrollHeight}px`;
          textarea.style.overflow = "hidden"; // Hide scrollbar if not needed
        }

        // Restore the scroll position to prevent page scrolling
        window.scrollTo(0, scrollPositionRef.current);
      }
    }, [value, autoSize, maxRows]);

    return (
      <textarea
        ref={textAreaRef}
        className={classNames(
          "my-1 w-full resize-none rounded border p-1 px-4 py-2 text-gray-600",
          rest.disabled ? "cursor-not-allowed bg-[#f1f1f1]" : "bg-white",
          "border-gray-400",
          "focus-visible:border-blue-300 focus-visible:ring-[1px] focus-visible:ring-blue-300",
          "focus:outline-none", // Remove default outline for clicks
          "focus:ring-[1px] focus:ring-blue-300", // Lighter and thinner outline on click
          "focus:border-blue-300", // Lighter border on click
          className,
        )}
        value={value}
        onChange={onChange}
        rows={minRows} // Default taller textarea
        style={{
          boxSizing: "border-box", // Include padding and border in height
          resize: "none", // Disable manual resizing to control via code
        }}
        {...rest}
      />
    );
  },
);
NormalTextArea.displayName = "NormalTextArea";
