"use client";
import { NormalButton } from "@/app/_components/ui/Button";
import { NormalTextArea } from "@/app/_components/ui/TextArea";
import { apiClient } from "@/trpc/react";
import { type SetState } from "@/utils/types";
import { useEffect, useState } from "react";

export const defaultImprovementPrompt = `Rewrite these tips into a prompt for an AI model. Turn it into a list of tips that go: "if you see xyz, reword it to abc". Also specify the reason for this tip if it was specified. If there is no reason, do not make one up`;

interface Props {
  prompt: string;
  improvementPrompt: string;
  setImprovementPrompt: SetState<string>;
}

const Modal = ({ prompt, improvementPrompt, setImprovementPrompt }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isFullyVisible, setIsFullyVisible] = useState(false);
  const [improvedPrompt, setImprovedPrompt] = useState("");
  const [isImprovingPrompt, setIsImprovingPrompt] = useState(false);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  // Function to open the modal
  const openModal = () => {
    setIsOpen(true);
    setTimeout(() => {
      setIsFullyVisible(true);
    }, 10); // Small timeout for proper animation trigger
  };

  // Function to close the modal
  const closeModal = () => {
    setIsFullyVisible(false);
    setIsFadingOut(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsFadingOut(false);
    }, 300); // Match the duration of the fade-out animation
  };

  // Handle outside click to close modal
  const handleOutsideClick = (e: MouseEvent) => {
    const modalContent = document.getElementById("modal-content");
    if (modalContent && !modalContent.contains(e.target as Node)) {
      closeModal();
    }
  };

  const improvePrompt = async (improvementPrompt: string, prompt: string) => {
    // Create a new AbortController instance for each request
    const controller = new AbortController();
    setAbortController(controller); // Store the controller to allow cancellation later

    try {
      // Send the request with the AbortController's signal
      const response = await apiClient.checker.improvePrompt.mutate(
        {
          improvementPrompt: `${improvementPrompt}\n\nHere is the original prompt:\n${prompt}`,
        },
        {
          signal: controller.signal, // Attach the abort signal
        },
      );

      // Handle streaming response
      for await (const content of response) {
        // Append each streamed chunk of content
        setImprovedPrompt((currImprovedPrompt) => currImprovedPrompt + content);
      }
    } catch (error) {
      if (controller.signal.aborted) {
        console.log("Stream was cancelled");
      } else {
        console.error("Error during streaming:", error);
      }
    }
    setIsImprovingPrompt(false);
  };

  // Cancel the stream when needed
  useEffect(() => {
    if (!isOpen && abortController) {
      abortController.abort(); // Trigger the cancellation
    }
  }, [isOpen, abortController]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <>
      <NormalButton
        className="mt-4 h-10 w-52"
        onClick={openModal}
        // disabled={prompt.trim() === ""}
      >
        Improve Your Prompt
      </NormalButton>
      {isOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
            isFadingOut ? "opacity-0" : "opacity-100"
          }`}
        >
          <div
            id="modal-content"
            className={`flex h-[90%] w-[80%] transform flex-col rounded-lg bg-white p-6 shadow-lg transition-transform duration-300 ${
              isFullyVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            <h2 className="mb-4 text-xl font-semibold">
              Improve Your Prompt with AI
            </h2>
            <p>
              {/* {`To make your checker work better, it's best to phrase it as a
              series of: "If you see abc, rephrase it to abc" instructions. `} */}
              Ask AI to improve your prompt:
            </p>
            <NormalTextArea
              value={improvementPrompt}
              onChange={(e) => {
                setImprovementPrompt(e.target.value);
              }}
              minRows={4}
            />
            <NormalButton
              className="mt-4 w-[26rem]"
              onClick={() => {
                setIsImprovingPrompt(true);
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                improvePrompt(improvedPrompt, prompt);
              }}
              disabled={
                isImprovingPrompt ||
                prompt.trim() === "" ||
                improvementPrompt.trim() === ""
              }
            >
              Ask AI to improve my prompt!
            </NormalButton>
            <div className="flex-grow overflow-auto whitespace-pre-line">
              {improvedPrompt}
            </div>
            <button
              className="self-start rounded pt-2 text-zinc-500 transition duration-300 hover:text-zinc-900"
              onClick={closeModal}
            >
              Return
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
