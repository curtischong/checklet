import { StopIcon } from "@/app/_components/icons/StopIcon";
import { LoadingButton } from "@/app/_components/ui/Button";
import { type CheckerStorefront } from "@/app/checker/[checkerId]/edit/CheckerTypes";
import { CheckerState } from "@/app/checker/[checkerId]/editor/suggestions/suggestionsTypes";
import { useEffect, useState } from "react";

interface Props {
  editorState: string;
  checkerState: CheckerState;
  checkDocument: (
    checkerId: string,
    doc: string,
    checkerState: CheckerState,
  ) => void;
  storefront: CheckerStorefront;
  onStop: () => void;
}

export const SuggestionContainerMetabuttons = ({
  editorState,
  checkerState,
  checkDocument,
  storefront,
  onStop,
}: Props) => {
  const [showStopButton, setShowStopButton] = useState(false);

  useEffect(() => {
    if (checkerState === CheckerState.Default) {
      setShowStopButton(false);
    } else {
      setShowStopButton(true);
    }
  }, [checkerState]);

  return (
    <div className="flex-start mx-auto flex h-[40px] flex-row items-center justify-normal space-x-8">
      <LoadingButton
        onClick={() =>
          checkDocument(storefront.checkerId, editorState, checkerState)
        }
        loading={checkerState !== CheckerState.Default}
        className="h-9 w-40"
        disabled={editorState === ""}
      >
        Check Document
      </LoadingButton>

      {/* Conditionally render the Stop button */}
      {showStopButton && (
        <div
          className={`flex cursor-pointer flex-row self-center text-gray-500 transition-all duration-300 hover:text-gray-800 ${
            showStopButton ? "animate-fadeInRight" : "animate-fadeOutLeft"
          }`}
          onClick={onStop}
        >
          <div className="ml-2 text-sm">Stop</div>
          {/* the color of the stop button follows the text color */}
          <StopIcon className="bg-red ml-2 h-4 w-4 self-center fill-current" />
        </div>
      )}
    </div>
  );
};
