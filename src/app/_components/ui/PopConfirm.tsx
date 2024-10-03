import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";

interface PopconfirmProps {
  title: string;
  onConfirm: () => void;
  onCancel?: () => void;
  children: React.ReactNode;
  autoConfirmOnPress?: boolean;
  isDeleteConfirm?: boolean;
  className?: string;
}

const Popconfirm: React.FC<PopconfirmProps> = ({
  title,
  onConfirm,
  onCancel,
  children,
  autoConfirmOnPress = false,
  isDeleteConfirm = false,
  className = "",
}) => {
  const [isMounted, setIsMounted] = useState(false); // Controls rendering
  const [isVisible, setIsVisible] = useState(false); // Controls opacity
  const triggerRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const animationDuration = 300; // in milliseconds

  const showPopconfirm = () => {
    setIsMounted(true);
  };

  const hidePopconfirm = () => {
    setIsVisible(false); // Start fade-out
    setTimeout(() => {
      setIsMounted(false); // Unmount after animation
    }, animationDuration);
  };

  const handleConfirm = () => {
    onConfirm();
    hidePopconfirm();
  };

  const handleCancel = () => {
    onCancel?.();
    hidePopconfirm();
  };

  useEffect(() => {
    if (isMounted) {
      // Trigger fade-in after mount
      // Using requestAnimationFrame to ensure the class is applied after the component is rendered
      requestAnimationFrame(() => {
        setIsVisible(true);
      });

      const handleClickOutside = (event: MouseEvent) => {
        if (
          dialogRef.current &&
          !dialogRef.current.contains(event.target as Node) &&
          triggerRef.current &&
          !triggerRef.current.contains(event.target as Node)
        ) {
          hidePopconfirm();
        }
      };

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          hidePopconfirm();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);

      // Focus on the Confirm button when popup opens
      confirmButtonRef.current?.focus();

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isMounted]);

  return (
    <div className="relative inline-block">
      <div
        onClick={() => {
          if (autoConfirmOnPress) {
            onConfirm();
          } else {
            showPopconfirm();
          }
        }}
        ref={triggerRef}
        className={className}
      >
        {children}
      </div>

      {isMounted && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          className={classNames(
            "absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 transform rounded-md border border-gray-300 bg-white p-4 opacity-0 shadow-md transition-opacity duration-300",
            {
              "opacity-100": isVisible,
            },
            "min-w-[200px]", // Sets a minimum width; adjust as needed
          )}
        >
          <div className="mb-3 text-center text-sm">{title}</div>
          <div className="flex justify-end space-x-2">
            <button
              className="rounded bg-gray-100 px-3 py-1 text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              ref={confirmButtonRef}
              className={classNames({
                "rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400":
                  !isDeleteConfirm,
                "rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400":
                  isDeleteConfirm,
              })}
              onClick={handleConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Popconfirm;
