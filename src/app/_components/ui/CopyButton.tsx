// src/components/CopyButton.tsx
import { CopyIcon } from "@/app/_components/icons/CopyIcon";
import React, { useState } from "react";

interface CopyButtonProps {
  textToCopy: string;
  className?: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy, className }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000); // Reset after 3 seconds
    } catch (error) {
      console.error("Failed to copy text: ", error);
      // Optionally, you can set an error state here
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`h-6 rounded px-2 text-zinc-600 transition-colors duration-300 hover:text-zinc-900 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
        copied
          ? "bg-green-200 hover:bg-green-300"
          : "bg-zinc-200 hover:bg-zinc-300"
      } ${className}`}
      disabled={textToCopy.trim() === ""}
    >
      <CopyIcon />
      {copied ? "Copied!" : "Copy improved prompt"}
    </button>
  );
};

export default CopyButton;
