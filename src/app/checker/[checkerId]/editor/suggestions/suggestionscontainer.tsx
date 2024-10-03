import {
  CoolChecklet,
  PencilChecklet,
  YayChecklet,
} from "@/app/_components/checklets/checklets";
import { SortIcon } from "@/app/_components/icons/SortIcon";
import { LoadingButton } from "@/app/_components/ui/Button";
import { Tooltip } from "@/app/_components/ui/ToolTip";
import { type CheckerStorefront } from "@/app/checker/[checkerId]/edit/CheckerTypes";
import { CheckerMetaButtons } from "@/app/checker/[checkerId]/editor/suggestions/CheckerMetaButtons";
import SuggestionCard2 from "@/app/checker/[checkerId]/editor/suggestions/SuggestionCard2";
import { apiClient, handleErr } from "@/trpc/react";
import { scrollToChild } from "@/utils/scroll";
import { cyrb53, pluralize } from "@/utils/strings";
import { type SetState } from "@/utils/types";
import { useParams, usePathname } from "next/navigation";
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
    a.tipName.localeCompare(b.tipName),
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
  const dismissedSuggestionHashes = useRef(new Set<number>()); // store the hashes of oldText and newText

  const { checkerId } = useParams();

  useEffect(() => {
    const sorted = [...suggestions].sort(Sorters[sortType]);
    setSortedSuggestions(sorted);
  }, [suggestions, sortType]);

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
        scrollToChild(suggestionsContainerRef.current!, ref.current);
      }
    }
  }, [activeSuggestion]);

  const hashSuggestion = (suggestion: Suggestion) => {
    return cyrb53(`${suggestion.oldText}old:new${suggestion.newText}`);
  };

  const dismissSuggestion = useCallback(
    (dismissedSuggestionId: string) => {
      const newSuggestions = [];
      for (const suggestion of suggestions) {
        if (suggestion.suggestionId === dismissedSuggestionId) {
          dismissedSuggestionHashes.current.add(hashSuggestion(suggestion));
        } else {
          newSuggestions.push(suggestion);
        }
      }
      setSuggestions(newSuggestions);
    },
    [setSuggestions, suggestions],
  );

  const renderSuggestions = React.useCallback(() => {
    suggestionsRefs.current = {}; // reset refs
    if (editorState !== "") {
      if (sortedSuggestions.length > 0) {
        return sortedSuggestions.map((s: Suggestion, index: number) => {
          const ref = React.createRef<HTMLDivElement>();
          suggestionsRefs.current[s.suggestionId] = ref;
          return (
            <SuggestionCard2
              key={index}
              suggestion={s}
              activeSuggestion={activeSuggestion}
              onClick={() => onCollapseClick(s)}
              onReplaceClick={(acceptedOption) =>
                acceptSuggestion(s, acceptedOption)
              }
              onDismiss={dismissSuggestion}
              ref={ref}
            />
          );
        });
      }

      if (!hasModifiedTextAfterChecking) {
        return (
          <NoSuggestionMessage
            checklet=<YayChecklet
              className="h-[12.75rem]"
              height={120}
              width={120}
            />
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
            checklet=<CoolChecklet
              className="h-[12.75rem]"
              height={120}
              width={120}
            />
            header={"Ready to check?"}
            content={
              <>
                <div className={"w-3/4"}>
                  {`Click 'Check Document' to check for mistakes`}
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
        checklet=<PencilChecklet height={120} width={120} />
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
    dismissSuggestion,
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

        // only show suggestions the user didn't dismiss. obv if they refresh the page this set isn't persisted. but it's okay!
        const filteredSuggestions = newSuggestions.filter(
          (suggestion) =>
            !dismissedSuggestionHashes.current.has(hashSuggestion(suggestion)),
        );

        filteredSuggestions.sort(Sorters[sortType]);
        setSuggestions(filteredSuggestions);
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
    <div className="sticky right-10 top-0 flex h-full flex-col pt-[50px]">
      <div className="mx-auto flex h-[40px] flex-row items-center justify-normal space-x-8">
        <LoadingButton
          onClick={checkDocument}
          loading={isLoading}
          className="h-9 w-40"
          disabled={editorState === ""}
        >
          Check Document
        </LoadingButton>
        {!pathName.endsWith("/edit") && (
          <div className="flex flex-row space-x-3">
            <CheckerMetaButtons
              checkerId={storefront.checkerId}
              checkerCreatorId={storefront.creatorId}
            />
          </div>
        )}
      </div>
      <div className="mt-[5px] h-[13px]">
        {/* {isLoading && <LoadingBar duration={editorState.length / 100 + 4} />} */}
        {isLoading && (
          <div>Generating suggestions... This will take a minute!</div>
        )}
      </div>
      <div className="mt-[5px] h-[40px]">
        <SuggestionsHeader
          suggestions={sortedSuggestions}
          setSortType={setSortType}
        />
      </div>
      <div
        className="px-6"
        style={{
          // add up all the heights and margin tops of the elements above
          maxHeight: "calc(100vh - 50px - 40px - 5px - 5px - 40px - 5px)",
          overflow: "auto",
          overscrollBehavior: "contain",
        }}
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
    <div className="text-16 flex pb-4 pt-1 font-bold">
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
