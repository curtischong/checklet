/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type CheckerStorefront } from "@/app/checker/[checkerId]/edit/CheckerTypes";
import {
  isWithinRange,
  newDocRange,
  type Suggestion,
  type SuggestionId,
} from "@/app/checker/[checkerId]/editor/suggestions/suggestionsTypes";
import { MAX_EDITOR_LEN } from "@/constants";
import { type SetState } from "@/utils/types";
import debounce from "lodash.debounce";
import React, {
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { toast } from "react-toastify";
import { RichTextarea, type RichTextareaHandle } from "rich-textarea";

export type TextboxContainerProps = {
  suggestions: Suggestion[];
  editorState: string;
  activeSuggestion: Suggestion | undefined;
  updateEditorState: (e: string) => void;
  updateActiveSuggestion: SetState<Suggestion | undefined>;
  isLoading: boolean;
  editorRef: RefObject<RichTextareaHandle | null>;
  storefront: CheckerStorefront;
  isSavingToLocalStorage: boolean;
};

export const TextboxContainer = ({
  suggestions,
  editorState,
  activeSuggestion,
  updateEditorState,
  updateActiveSuggestion,
  isLoading,
  editorRef,
  storefront,
  isSavingToLocalStorage,
}: TextboxContainerProps): JSX.Element => {
  // these two are needed so we can scroll to the underline span when we click on a card
  // we need two maps since we only know:
  // 1) the blockLoc and the range together OR
  // 2) the rangeBlockLoc and the ref to the span
  // we don't know 1) and 2) at the same time. so we use two maps

  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedSave = useMemo(
    () =>
      debounce((newState: string) => {
        localStorage.setItem("editorText", newState);
      }, 1000),
    [],
  );

  useEffect(() => {
    if (isSavingToLocalStorage) {
      debouncedSave(editorState);
    }
  }, [isSavingToLocalStorage, editorState, debouncedSave]);

  const handleUnderlineClicked = useCallback(
    (suggestionId: SuggestionId) => {
      // PERF: try using a map, but since there's only so few suggestions, it might not be worth it
      const suggestion = suggestions.find((s) => {
        return s.suggestionId === suggestionId;
      });

      if (!suggestion) {
        toast.error("Could not find key corresponding suggestion");
        return;
      }

      updateActiveSuggestion(suggestion);
      //   mixpanelTrack("Underlined text selected", {
      //     suggestion,
      //   });
    },
    [suggestions, updateActiveSuggestion],
  );

  return (
    <div className="textbox col-span-3">
      <RichTextarea
        placeholder={storefront.placeholder || "Write your document here!"}
        ref={editorRef as any}
        value={editorState}
        onChange={(e) => {
          updateEditorState(e.target.value);
        }}
        autoHeight={true}
        className="resize-none bg-white pb-32 tracking-[0.01em] outline-none" // tracking increases letter spacing
        // the styling MUST be done via the style prop, not tailwind
        style={{
          width: "100%",
          display: "block",
        }}
        disabled={isLoading}
        maxLength={MAX_EDITOR_LEN}
      >
        {(v) => {
          // This is a similar problem to https://leetcode.com/problems/describe-the-painting/\

          // The main thing we need to solve is: "is this span currently in the range of a suggestion"
          // if it is, we need to underline it
          // we can solve this using a line-sweep algorithm.
          // the main idea is to iterate through all the suggestions and then insert the start/end of the ranges into two "sets"
          // then we sort the merged sets and iterate from left to right. Every time we see a "start", we increment a counter
          // and we decrement the counter everytime we see an "end"
          // if the counter is positive, then we know that the span is inside a suggestion
          // - in other words: a span is only underlined if at the START of the span, the counter is positive
          //
          // NOTE: we are not using sets, but instead using maps so we can track which suggestionId is active (needed to find which suggestion to bring up when the line is clicked)
          //
          // I'm not sure if this approach is faster than thedifference array solutions to the problem, but that problem is harder than this thing
          // also, we don't want to allocate 10k array indexes cause this logic needs to run VERY frequently

          const starts = new Map<number, SuggestionId[]>(); // we need the suggestionId instead of an number, so we can set the suggetionIdToRef map
          const ends = new Map<number, SuggestionId[]>();
          for (const suggestion of suggestions) {
            const start = suggestion.range.start;
            const end = suggestion.range.end;
            const dStart = starts.get(start);
            if (dStart) {
              dStart.push(suggestion.suggestionId);
            } else {
              starts.set(start, [suggestion.suggestionId]);
            }
            const dEnd = ends.get(end);
            if (dEnd) {
              dEnd.push(suggestion.suggestionId);
            } else {
              ends.set(end, [suggestion.suggestionId]);
            }
          }
          const allPoints = new Set([...starts.keys(), ...ends.keys()]);
          allPoints.add(0);
          const sortedPoints = Array.from(allPoints);
          sortedPoints.sort((a, b) => a - b);

          const activeSuggestions = new Set<SuggestionId>();
          const res: JSX.Element[] = [];
          let activeSuggestionRef = React.createRef<HTMLSpanElement>();
          for (let i = 0; i < sortedPoints.length - 1; i++) {
            const start = sortedPoints[i]!;
            const end = sortedPoints[i + 1]!;
            const sSuggestions = starts.get(start) ?? [];
            const eSuggestions = ends.get(start) ?? []; // yes. start. not end. this is not a typo
            sSuggestions.forEach((item) => activeSuggestions.add(item));
            eSuggestions.forEach((item) => activeSuggestions.delete(item));

            const range = newDocRange(start, end);
            const isWithinSuggestion = activeSuggestions.size > 0;
            if (isWithinSuggestion) {
              const isInActiveSuggestion =
                activeSuggestion &&
                isWithinRange(range, activeSuggestion.range);

              const style = isInActiveSuggestion
                ? {
                    backgroundColor: "#DBEBFF",
                  }
                : {};

              const ref = React.createRef<HTMLSpanElement>();
              const firstSuggestionId: SuggestionId = activeSuggestions
                .values()
                .next().value;

              const span = (
                <span
                  ref={ref}
                  key={res.length}
                  className="border-b-[2px] border-[#189bf2]"
                  style={style}
                  onClick={() => handleUnderlineClicked(firstSuggestionId)}
                >
                  {v.substring(start, end)}
                </span>
              );
              if (isInActiveSuggestion) {
                activeSuggestionRef = ref;
              }

              res.push(span);
            } else {
              res.push(<span key={res.length}>{v.substring(start, end)}</span>);
            }
          }

          // scrolls the window to the active suggestion
          // the reason why we aren't using a map of refs like so: is becuase this component is rendered multiple times when the user clicks on a suggestion (e.g. items are highlighted). So the refs we assigned would become outdated
          // by the time we try to scroll to the active suggestion via a function in useEffect
          //   const suggestionIdToRef = React.useRef<SuggestionIdToRef>({});
          // need to settimeout so the ref object is attached to the dom
          timeoutIdRef.current = setTimeout(() => {
            // if (timeoutIdRef.current) {
            //   clearTimeout(timeoutIdRef.current);
            // }
            const suggestionTop =
              activeSuggestionRef.current?.getBoundingClientRect().top;
            // console.log("suggestionTop", suggestionTop);
            console.log("acitveSuggestionRef", activeSuggestionRef);
            if (suggestionTop) {
              // window.scrollTo({ top: suggestionTop, behavior: "smooth" });

              // TODO: scroll into view is a bit buggy.
              activeSuggestionRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }
          }, 100);

          // we need to append the (non-underlined) text from the last suggestion to the end of the string
          if (sortedPoints[sortedPoints.length - 1]! < v.length) {
            res.push(
              <span key={res.length}>
                {v.substring(sortedPoints[sortedPoints.length - 1]!)}
              </span>,
            );
          }

          return res;
        }}
      </RichTextarea>
    </div>
  );
};
