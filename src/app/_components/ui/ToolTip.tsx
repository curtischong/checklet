"use client";
import React, { useEffect, useRef, useState, type ReactElement } from "react";

export type Placement =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-end"
  | "bottom-end";

interface TooltipProps {
  title: string | JSX.Element;
  placement?: Placement;
  children: ReactElement;
}

export const Tooltip: React.FC<TooltipProps> = ({
  title,
  placement = "top",
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLElement>(null);

  const showTooltip = () => setVisible(true);
  const hideTooltip = () => setVisible(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        childRef.current &&
        !childRef.current.contains(event.target as Node)
      ) {
        setVisible(false);
      }
    };

    if (visible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visible]);

  const childWithProps = React.cloneElement(children, {
    ref: childRef,
    onMouseEnter: showTooltip,
    onMouseLeave: hideTooltip,
    onFocus: showTooltip,
    onBlur: hideTooltip,
    "aria-describedby": visible ? "custom-tooltip" : undefined,
  });

  const getTooltipPositionClasses = () => {
    switch (placement) {
      case "top":
        return "bottom-full left-1/2 transform -translate-x-1/2 mb-2";
      case "bottom":
        return "top-full left-1/2 transform -translate-x-1/2 mt-2";
      case "left":
        return "right-full top-1/2 transform -translate-y-1/2 mr-2";
      case "right":
        return "left-full top-1/2 transform -translate-y-1/2 ml-2";
      case "top-end":
        return "bottom-full left-1/2 transform -translate-x-full mb-2";
      case "bottom-end":
        return "top-full left-1/2 transform -translate-x-full mt-2";
      default:
        return "bottom-full left-1/2 transform -translate-x-1/2 mb-2";
    }
  };

  const getArrowPositionClasses = () => {
    switch (placement) {
      case "top":
        return "top-full left-1/2 transform -translate-x-1/2";
      case "bottom":
        return "bottom-full left-1/2 transform -translate-x-1/2";
      case "left":
        return "left-full top-1/2 transform -translate-y-1/2";
      case "right":
        return "right-full top-1/2 transform -translate-y-1/2";
      default:
        return "top-full left-1/2 transform -translate-x-1/2";
    }
  };

  const renderTitle = () => {
    if (typeof title === "string") {
      return title.split("\n").map((line, index) => (
        <span key={index}>
          {line}
          <br />
        </span>
      ));
    }
    return title;
  };

  return (
    <div className="relative inline-block select-none">
      {childWithProps}
      <div
        ref={tooltipRef}
        role="tooltip"
        id="custom-tooltip"
        className={`absolute z-50 w-max max-w-xs rounded bg-black px-3 py-2 text-sm text-white shadow-lg transition-opacity duration-300 ${
          visible ? "opacity-100" : "pointer-events-none opacity-0"
        } ${getTooltipPositionClasses()}`}
      >
        {renderTitle()}
        <div
          className={`border-6 absolute h-0 w-0 border-transparent bg-transparent ${
            placement === "top"
              ? "border-t-black"
              : placement === "bottom"
                ? "border-b-black"
                : placement === "left"
                  ? "border-l-black"
                  : "border-r-black"
          } ${getArrowPositionClasses()}`}
        ></div>
      </div>
    </div>
  );
};
