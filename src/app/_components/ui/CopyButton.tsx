// src/components/CopyButton.tsx
import { CopyIcon } from "@/app/_components/icons/CopyIcon";
import React, { useState } from "react";
import { toast } from "react-toastify";

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
      toast.error("Failed to copy text");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex h-8 items-center space-x-2 rounded px-3 text-zinc-600 transition-colors duration-300 hover:text-zinc-900 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
        copied
          ? "bg-green-200 hover:bg-green-300"
          : "bg-zinc-200 hover:bg-zinc-300"
      } ${className}`}
      disabled={textToCopy.trim() === ""}
    >
      <CopyIcon className="h-4 w-4" />
      <span>{copied ? "Copied!" : "Copy improved prompt"}</span>
    </button>
  );
};

export default CopyButton;
