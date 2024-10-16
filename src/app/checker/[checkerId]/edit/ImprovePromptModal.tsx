"use client";
import { NormalButton } from "@/app/_components/ui/Button";
import CopyButton from "@/app/_components/ui/CopyButton";
import { NormalTextArea } from "@/app/_components/ui/TextArea";
import { useTrpcCtx } from "@/app/TrpcCtx";
import { type SetState } from "@/utils/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  prompt: string;
  improvementPrompt: string;
  setImprovementPrompt: SetState<string>;
  improvedPrompt: string;
  setImprovedPrompt: SetState<string>;
}

const Modal = ({
  prompt,
  improvementPrompt,
  setImprovementPrompt,
  improvedPrompt,
  setImprovedPrompt,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isFullyVisible, setIsFullyVisible] = useState(false);
  const [isImprovingPrompt, setIsImprovingPrompt] = useState(false);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const { trpcClient } = useTrpcCtx();

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

  const improvePrompt = (improvementPrompt: string, prompt: string) => {
    // Create a new AbortController instance for each request
    const controller = new AbortController();
    setAbortController(controller); // Store the controller to allow cancellation later

    try {
      // Send the request with the AbortController's signal
      trpcClient.checker.improvePrompt.subscribe(
        {
          improvementPrompt: `${improvementPrompt}\n\nHere is the original prompt:\n${prompt}`,
        },
        {
          signal: controller.signal, // Attach the abort signal
          onData(thoughtChunk: string) {
            setImprovedPrompt(
              (currImprovedPrompt) => currImprovedPrompt + thoughtChunk,
            );
          },
          onError(error) {
            console.error("Error in subscription", error);
            toast.error("Error improving prompt", error);
            setIsImprovingPrompt(false);
          },
          onComplete() {
            setIsImprovingPrompt(false);
          },
        },
      );
    } catch (error) {
      if (controller.signal.aborted) {
        console.log("Stream was cancelled");
      } else {
        console.error("Error during streaming:", error);
      }
      setIsImprovingPrompt(false);
    }
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
      <NormalButton className="mb-2 mt-2 h-10 w-52" onClick={openModal}>
        Improve Your Prompt
      </NormalButton>
      {isOpen && (
        <div
          className={`fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
            isFadingOut ? "opacity-0" : "opacity-100"
          }`}
        >
          <div
            id="modal-content"
            className={`flex h-[90vh] w-[80vw] flex-col rounded-lg bg-background p-6 shadow-lg transition-transform duration-300 ${
              isFullyVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            <div className="flex flex-row justify-between">
              <h2 className="text-xl font-semibold">
                Improve Your Prompt with AI
              </h2>
              <button
                className="rounded text-zinc-500 transition duration-300 hover:text-zinc-900"
                onClick={closeModal}
              >
                Return
              </button>
            </div>

            <p className="mt-4">
              {`To make your checker work better, it's best to phrase it as a
              series of: "If you see abc, rephrase it to abc" instructions. If your checker's instructions don't look like this, ask AI to rewrite your tips with these instructions:`}
            </p>

            {/* Textarea Container */}
            <div className="mt-4 flex-shrink-0">
              <NormalTextArea
                value={improvementPrompt}
                onChange={(e) => {
                  setImprovementPrompt(e.target.value);
                }}
                minRows={4}
                maxRows={4}
                className="h-24 w-full" // Fixed height to prevent shrinking
              />
            </div>

            {/* Improved Prompt Display Area */}
            <div className="relative mt-4 flex-grow overflow-auto whitespace-pre-line rounded-lg border border-zinc-400 p-4">
              {improvedPrompt || "Your improved prompt will appear here..."}
            </div>

            {/* Buttons Container */}
            <div className="mt-4 flex flex-shrink-0 flex-row justify-between">
              <NormalButton
                className="w-full max-w-[26rem]"
                onClick={() => {
                  setIsImprovingPrompt(true);
                  // eslint-disable-next-line @typescript-eslint/no-floating-promises
                  improvePrompt(improvementPrompt, prompt);
                }}
                disabled={
                  isImprovingPrompt ||
                  prompt.trim() === "" ||
                  improvementPrompt.trim() === ""
                }
              >
                {isImprovingPrompt
                  ? "Improving..."
                  : "Ask AI to improve my prompt!"}
              </NormalButton>
              <CopyButton
                textToCopy={improvedPrompt}
                className="ml-4 self-end"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
