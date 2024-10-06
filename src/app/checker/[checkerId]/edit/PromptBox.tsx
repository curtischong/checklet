import React, { useState } from "react";

interface PromptBoxProps {
  improvedPrompt: string;
}

const PromptBox: React.FC<PromptBoxProps> = ({ improvedPrompt }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(improvedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Hide the tooltip after 2 seconds
    } catch (error) {
      console.error("Failed to copy the prompt:", error);
    }
  };

  return (
    <div className="relative mt-4 flex-grow overflow-auto whitespace-pre-line rounded-lg border border-zinc-400 p-4">
      {improvedPrompt}
    </div>
  );
};

export default PromptBox;
