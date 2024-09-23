import { SortIcon } from "@/app/_components/icons/SortIcon";
import { LoadingButton, NormalButton } from "@/app/_components/ui/Button";
import { Tooltip } from "@/app/_components/ui/ToolTip";
import { type CheckerStorefront } from "@/app/checker/[checkerId]/edit/CheckerTypes";
import { SuggestionCard } from "@/app/checker/[checkerId]/editor/suggestions/SuggestionCard";
import { useClientCtx } from "@/app/ClientCtx";
import { apiClient, handleErr } from "@/trpc/react";
import { pluralize } from "@/utils/strings";
import { type SetState } from "@/utils/types";
import CoolChecklet from "@public/checklets/cool.svg";
import PencilChecklet from "@public/checklets/pencil.svg";
import YayChecklet from "@public/checklets/yay.svg";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { NoSuggestionMessage } from "./nosuggestionmessage";
import { type Suggestion, type SuggestionIdToRef } from "./suggestionsTypes";

export type Props = {
  setIsLoading: SetState<boolean>;
  isLoading: boolean;
  setHasModifiedTextAfterChecking: SetState<boolean>;
  setSuggestions: SetState<Suggestion[]>;
  suggestions: Suggestion[];
  activeSuggestion: Suggestion | undefined;
  setActiveSuggestion: SetState<Suggestion | undefined>;
  editorState: string;
  acceptSuggestion: (suggestion: Suggestion, acceptedOption: string) => void;
  hasModifiedTextAfterChecking: boolean;
  storefront: CheckerStorefront;
};

export enum SortType {
  TextOrder,
  Category,
}

export const Sorters = {
  [SortType.TextOrder]: (a: Suggestion, b: Suggestion): number => {
    const res = a.range.start - b.range.start; // sort by order of appearance
    if (res !== 0) {
      return res;
    }
    return a.range.end - b.range.end; // if they have the same start, sort by end. We want the shorter suggestions to be first, so their underlines are visible
  },
  [SortType.Category]: (a: Suggestion, b: Suggestion): number =>
    // a.checkId.localeCompare(b.checkId), // this second sort is just to sort by checkId (so checks that are the same are next to each other)
    a.check.name.localeCompare(b.check.name),
};

export const SuggestionsContainer: React.FC<Props> = ({
  setIsLoading,
  isLoading,
  setHasModifiedTextAfterChecking,
  setSuggestions,
  suggestions,
  activeSuggestion,
  setActiveSuggestion,
  editorState,
  acceptSuggestion,
  hasModifiedTextAfterChecking,
  storefront,
}: Props) => {
  const [sortedSuggestions, setSortedSuggestions] = useState<Suggestion[]>([]);
  const suggestionsContainerRef = useRef<HTMLDivElement>(null);
  const suggestionsRefs = useRef<SuggestionIdToRef>({});
  const [sortType, setSortType] = useState(SortType.TextOrder);

  const router = useRouter();
  const { checkerId } = useParams();

  useEffect(() => {
    const sorted = [...suggestions].sort(Sorters[sortType]);
    setSortedSuggestions(sorted);
  }, [suggestions, sortType]);

  const { user } = useClientCtx();

  const onCollapseClick = useCallback(
    (s: Suggestion) => {
      if (activeSuggestion === s) {
        // mixpanelTrack("Suggestion closed", {
        //   suggestion: s,
        // });
        setActiveSuggestion(undefined);
      } else {
        // mixpanelTrack("Suggestion opened", {
        //   suggestion: s,
        // });
        setActiveSuggestion(s);
      }
    },
    [activeSuggestion, setActiveSuggestion],
  );

  useEffect(() => {
    if (activeSuggestion) {
      const ref = suggestionsRefs.current[activeSuggestion.suggestionId]!;
      // we cannot use scrollIntoView because there is a bug in its implementation in chrome
      // I even tried wrapping it in a requestAnimationFrame but it doesn't work
      // https://github.com/facebook/react/issues/23396
      if (ref.current) {
        const scrollHeight = ref.current.offsetTop;
        suggestionsContainerRef.current?.scrollTo({
          left: 0,
          top: scrollHeight - suggestionsContainerRef.current.offsetHeight / 2,
          behavior: "smooth",
        });
      }
    }
  }, [activeSuggestion]);

  const renderSuggestions = React.useCallback(() => {
    suggestionsRefs.current = {}; // reset refs
    if (editorState !== "") {
      if (sortedSuggestions.length > 0) {
        return sortedSuggestions.map((s: Suggestion, index: number) => {
          const ref = React.createRef<HTMLDivElement>();
          suggestionsRefs.current[s.suggestionId] = ref;
          return (
            <SuggestionCard
              key={index}
              suggestion={s}
              activeSuggestion={activeSuggestion}
              onClick={() => onCollapseClick(s)}
              onReplaceClick={(acceptedOption) =>
                acceptSuggestion(s, acceptedOption)
              }
              ref={ref}
            />
          );
        });
      }

      if (!hasModifiedTextAfterChecking) {
        return (
          <NoSuggestionMessage
            imageSrc={YayChecklet.src as string}
            header={"No issues found"}
            content={
              <>
                <div className={"w-3/4"}>
                  We checked your text and found no issues &#10084;
                </div>
              </>
            }
          />
        );
      } else {
        return (
          <NoSuggestionMessage
            imageSrc={CoolChecklet.src as string}
            header={"Ready to check?"}
            content={
              <>
                <div className={"w-3/4"}>
                  Click &apos;Check Document&apos; to check for mistakes
                  &#128640;
                </div>
              </>
            }
          />
        );
      }
    }

    return (
      <NoSuggestionMessage
        imageSrc={PencilChecklet.src as string}
        header={"Nothing to check yet"}
        content={
          <div className={"w-[70%]"}>Start writing or paste your document.</div>
        }
      />
    );
  }, [
    editorState,
    sortedSuggestions,
    hasModifiedTextAfterChecking,
    activeSuggestion,
    onCollapseClick,
    acceptSuggestion,
  ]);

  const checkDocument = useCallback((): void => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    handleErr(
      apiClient.checker.checkDoc.query({
        doc: editorState,
        checkerId: checkerId as string,
      }),
      (response) => {
        setIsLoading(false);
        if (!response) {
          toast.error(
            "Something went wrong, please let Curtis know on Discord!",
          );
          return;
        }
        setHasModifiedTextAfterChecking(false);

        const newSuggestions = response.suggestions;
        console.log("newSuggestions", newSuggestions);
        newSuggestions.sort(Sorters[sortType]);
        setSuggestions(newSuggestions);

        // mixpanelTrack("Check Document Clicked", {
        //   "Number of suggestions generated": newSuggestions.length,
        //   Suggestions: newSuggestions,
        //   Input: plaintext,
        // });
      },
      () => {
        setIsLoading(false);
      },
    );
  }, [
    checkerId,
    editorState,
    isLoading,
    setHasModifiedTextAfterChecking,
    setIsLoading,
    setSuggestions,
    sortType,
  ]);
  const pathName = usePathname();

  return (
    <div className="mt-14 flex w-[300px] flex-col">
      <div>
        <div className="flex flex-col space-y-2">
          {user?.id === storefront.creatorId && !pathName.endsWith("/edit") && (
            <NormalButton
              className="mb-4 py-[4px]"
              onClick={() => {
                router.push(`/create/checker/${checkerId as string}`);
              }}
            >
              Edit this Checker
            </NormalButton>
          )}
        </div>
      </div>
      <div className="mx-auto flex flex-row items-center justify-normal space-x-8">
        <LoadingButton
          onClick={checkDocument}
          loading={isLoading}
          className="h-9 w-40"
          disabled={editorState === ""}
        >
          Check Document
        </LoadingButton>
        {/* <EnterApiKeyModal
                    isOpen={isEnterApiKeyOpen}
                    setIsOpen={setIsEnterApiKeyOpen}
                    updateModelType={updateModelType}
                />
                <div className="w-[108px]">
                    <SlidingRadioButton
                        setSelected={(newModelName: string) => {
                            const newModelType = nameToModelType(newModelName);
                            if (newModelType === ModelType.o1) {
                                setIsEnterApiKeyOpen(true);
                            }
                            updateModelType(newModelType as ModelType);
                        }}
                        selected={modelTypeToName(modelType)}
                        options={[ModelType.GPT4o, ModelType.o1].map(
                            modelTypeToName,
                        )}
                        className="py-1"
                    />
                </div> */}
      </div>
      <SuggestionsHeader
        suggestions={sortedSuggestions}
        setSortType={setSortType}
      />
      <div
        className="px-4"
        style={{ maxHeight: "calc(70vh)", overflow: "auto" }}
        ref={suggestionsContainerRef}
      >
        {renderSuggestions()}
      </div>
    </div>
  );
};

const SortIconWithTooltip = (
  sortType: SortType,
  tooltip: string,
  setSortType: SetState<SortType>,
) => {
  return (
    <Tooltip title={tooltip}>
      {/* we need to wrap it in a div element so events are fired onhover and the Tooltip component can detect the hover */}
      <div>
        <SortIcon
          className="ml-2 cursor-pointer"
          onClick={() => setSortType(sortType)}
        />
      </div>
    </Tooltip>
  );
};

const SuggestionsHeader = ({
  suggestions,
  setSortType,
}: {
  suggestions: Suggestion[];
  setSortType: SetState<SortType>;
}) => {
  return (
    <div className="text-16 mt-10 flex pb-4 pt-1 font-bold">
      {suggestions.length > 0 && (
        <>
          <div className="ml-4 flex flex-row">
            <div className="mr-1 font-bold">{suggestions.length}</div>
            <div className="text-12">
              {pluralize("Suggestion", suggestions.length)}
            </div>
          </div>
          <div className="ml-auto mr-10 mt-1 flex space-x-2">
            {SortIconWithTooltip(
              SortType.TextOrder,
              "Sort by text order",
              setSortType,
            )}
            {SortIconWithTooltip(
              SortType.Category,
              "Sort by category",
              setSortType,
            )}
          </div>
        </>
      )}
    </div>
  );
};
