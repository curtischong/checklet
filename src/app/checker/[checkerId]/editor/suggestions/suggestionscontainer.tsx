"use client";
import {
  CoolChecklet,
  PencilChecklet,
  YayChecklet,
} from "@/app/_components/checklets/checklets";
import { SortIcon } from "@/app/_components/icons/SortIcon";
import { SlidingRadioButton } from "@/app/_components/ui/SlidingRadioButton";
import { Tooltip } from "@/app/_components/ui/ToolTip";
import { type CheckerStorefront } from "@/app/checker/[checkerId]/edit/CheckerTypes";
import LoadingBar from "@/app/checker/[checkerId]/editor/LoadingBar";
import SuggestionCard2 from "@/app/checker/[checkerId]/editor/suggestions/SuggestionCard2";
import { SuggestionContainerMetabuttons } from "@/app/checker/[checkerId]/editor/suggestions/SuggestionContainerMetabuttons";
import { ThoughtProcess } from "@/app/checker/[checkerId]/editor/suggestions/ThoughtProcess";
import { useTrpcCtx } from "@/app/TrpcCtx";
import { handleErr } from "@/trpc/react";
import { scrollToChild } from "@/utils/scroll";
import { pluralize } from "@/utils/strings";
import { type SetState } from "@/utils/types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { NoSuggestionMessage } from "./nosuggestionmessage";
import {
  CheckerState,
  hashSuggestion,
  SidePanelPageEnum,
  type Suggestion,
  type SuggestionIdToRef,
} from "./suggestionsTypes";

export type Props = {
  sidePanelPageEnum: SidePanelPageEnum;
  setSidePanelPageEnum: SetState<SidePanelPageEnum>;
  checkerThoughts: string | null;
  checkerState: CheckerState;
  setSuggestions: SetState<Suggestion[]>;
  suggestions: Suggestion[];
  activeSuggestion: Suggestion | undefined;
  setActiveSuggestion: SetState<Suggestion | undefined>;
  editorState: string;
  acceptSuggestion: (suggestion: Suggestion, acceptedOption: string) => void;
  hasModifiedTextAfterChecking: boolean;
  storefront: CheckerStorefront;
  sortType: SortType;
  setSortType: SetState<SortType>;
  dismissedSuggestionHashes: React.MutableRefObject<Set<number>>;
  checkDocument: (
    checkerId: string,
    doc: string,
    checkerState: CheckerState,
  ) => void;
  onStop: () => void;
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
  sidePanelPageEnum,
  setSidePanelPageEnum,
  checkerThoughts,
  checkerState,
  setSuggestions,
  suggestions,
  activeSuggestion,
  setActiveSuggestion,
  editorState,
  acceptSuggestion,
  hasModifiedTextAfterChecking,
  storefront,
  sortType,
  setSortType,
  dismissedSuggestionHashes,
  checkDocument,
  onStop,
}: Props) => {
  const [sortedSuggestions, setSortedSuggestions] = useState<Suggestion[]>([]);
  const suggestionsContainerRef = useRef<HTMLDivElement>(null);
  const suggestionsRefs = useRef<SuggestionIdToRef>({});
  const [isRegenerating, setIsRegenerating] = useState(false);
  const { trpcClient } = useTrpcCtx();

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

  const onRegenSuggestion = useCallback(
    (suggestion: Suggestion, regeneratePrompt: string) => {
      const start = suggestion.range.start - 100;
      const end = suggestion.range.end + 100;
      const oldDocWithContext = editorState.substring(start, end);
      setIsRegenerating(true);
      handleErr(
        trpcClient.checker.regenSuggestion.mutate({
          oldText: suggestion.oldText,
          newText: suggestion.newText,
          suggestionName: suggestion.tipName,
          suggestionReason: suggestion.reason,
          oldDocWithContext,
          regeneratePrompt,
        }),
        (newText) => {
          setIsRegenerating(false);
          console.log("newText", newText);
          setSuggestions((currSuggestions) => {
            const newSuggestions = [...currSuggestions];
            const index = newSuggestions.findIndex(
              (s) => s.suggestionId === suggestion.suggestionId,
            );
            if (index !== -1) {
              newSuggestions[index]!.newText = newText!;
            }
            return newSuggestions;
          });
        },
        (_err) => {
          setIsRegenerating(false);
        },
      );
    },
    [editorState, setSuggestions],
  );

  const renderSuggestions = React.useCallback(() => {
    suggestionsRefs.current = {}; // reset refs
    if (editorState !== "") {
      if (sortedSuggestions.length > 0) {
        return sortedSuggestions.map((s: Suggestion) => {
          const ref = React.createRef<HTMLDivElement>();
          suggestionsRefs.current[s.suggestionId] = ref;
          return (
            <SuggestionCard2
              key={s.suggestionId}
              suggestion={s}
              activeSuggestion={activeSuggestion}
              onClick={() => onCollapseClick(s)}
              onAccept={(acceptedOption) => acceptSuggestion(s, acceptedOption)}
              onDismiss={dismissSuggestion}
              onRegenerate={onRegenSuggestion}
              ref={ref}
              isRegenerating={
                isRegenerating || checkerState !== CheckerState.Default
              }
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
    checkerState,
    isRegenerating,
  ]);

  return (
    <div className="sticky right-10 top-0 z-30 flex h-full max-w-[400px] flex-col pt-[50px]">
      <SuggestionContainerMetabuttons
        editorState={editorState}
        checkerState={checkerState}
        checkDocument={checkDocument}
        storefront={storefront}
        onStop={onStop}
      />
      <div className="h-[10px]">
        {checkerState === CheckerState.Improving && (
          <LoadingBar duration={editorState.length / 100 + 4} />
        )}
      </div>
      {checkerThoughts !== null && (
        <div className="mx-auto h-[30px]">
          <SlidingRadioButton
            options={[SidePanelPageEnum.Tips, SidePanelPageEnum.Thoughts]}
            selected={sidePanelPageEnum}
            setSelected={setSidePanelPageEnum as any}
          />
        </div>
      )}
      {sidePanelPageEnum === SidePanelPageEnum.Thoughts ? (
        <div className="mt-[5px]">
          <ThoughtProcess checkerThoughts={checkerThoughts} />
        </div>
      ) : (
        <>
          <div className="mt-[5px] h-[40px]">
            <SuggestionsHeader
              suggestions={sortedSuggestions}
              setSortType={setSortType}
            />
          </div>
          <div
            className="px-6 pb-10"
            style={{
              // add up all the heights and margin tops of the elements above
              maxHeight: "calc(100vh - 50px - 40px - 10px - 30px - 5px - 40px)",
              overflow: "auto",
              overscrollBehavior: "contain",
            }}
            ref={suggestionsContainerRef}
          >
            {renderSuggestions()}
          </div>
        </>
      )}
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
