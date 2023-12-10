import React, {
    // createRef,
    useCallback,
    useEffect,
} from "react";
import * as pdfjs from "pdfjs-dist";
import { mixpanelTrack } from "../../../utils";
import { Ref, SetState } from "@utils/types";
import {
    DocRange,
    Suggestion,
    SuggestionId,
    isWithinRange,
    newDocRange,
} from "@api/ApiTypes";
import { toast } from "react-toastify";
import { RichTextarea, RichTextareaHandle } from "rich-textarea";
import { SuggestionIdToRef } from "@components/editor/suggestions/suggestionsTypes";
import debounce from "lodash.debounce";
import { MAX_EDITOR_LEN } from "src/constants";
import { CheckerStorefront } from "@components/create-checker/CheckerTypes";

// need same version with worker and pdfjs for it to work properly
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export type TextboxContainerProps = {
    suggestions: Suggestion[];
    editorState: string;
    activeSuggestion: Suggestion | undefined;
    updateEditorState: (e: string) => void;
    updateActiveSuggestion: SetState<Suggestion | undefined>;
    isLoading: boolean;
    editorRef: Ref<RichTextareaHandle | null>;
    storefront: CheckerStorefront;
};

// const highlightColors = ["#CAE2F1", "#CCEAA5", "#DCBAE5", "#F5EBBB", "#DCBAB9"];

export const TextboxContainer = ({
    suggestions,
    editorState,
    activeSuggestion,
    updateEditorState,
    updateActiveSuggestion,
    isLoading,
    editorRef,
    storefront,
}: TextboxContainerProps): JSX.Element => {
    // these two are needed so we can scroll to the underline span when we click on a card
    // we need two maps since we only know:
    // 1) the blockLoc and the range together OR
    // 2) the rangeBlockLoc and the ref to the span
    // we don't know 1) and 2) at the same time. so we use two maps
    const suggestionIdToRef = React.useRef<SuggestionIdToRef>({});

    useEffect(() => {
        editorRef.current?.focus();

        const prevDocument = localStorage.getItem("editorText");
        if (prevDocument) {
            updateEditorState(prevDocument);
        }
    }, []);

    const debouncedSave = useCallback(
        debounce((newState) => {
            localStorage.setItem("editorText", newState);
        }, 1000),
        [],
    );

    useEffect(() => {
        debouncedSave(editorState);
    }, [editorState, debouncedSave]);

    useEffect(() => {
        if (activeSuggestion) {
            const ref =
                suggestionIdToRef.current[activeSuggestion.suggestionId];
            if (ref?.current) {
                // we cannot use scrollIntoView because there is a bug in its implementation in chrome
                // I even tried wrapping it in a requestAnimationFrame but it doesn't work
                // https://github.com/facebook/react/issues/23396
                const scrollHeight = ref.current.offsetTop;
                editorRef.current?.scrollTo({
                    left: 0,
                    top: scrollHeight - editorRef.current.offsetHeight / 2,
                    behavior: "smooth",
                });
            }
        }
    }, [activeSuggestion]);

    const handleUnderlineClicked = useCallback(
        (range: DocRange) => {
            // PERF: try using a map, but since there's only so few suggestions, it might not be worth it
            const suggestion = suggestions.find((s) => {
                return (
                    s.range.start === range.start && s.range.end === range.end
                );
            });

            if (!suggestion) {
                toast.error("Could not find key corresponding suggestion");
                return;
            }

            updateActiveSuggestion(suggestion);
            mixpanelTrack("Underlined text selected", {
                suggestion,
            });
        },
        [suggestions],
    );

    return (
        <div
            className="textbox col-span-3"
            style={{ maxHeight: "calc(100vh - 80px)", overflow: "auto" }}
        >
            <RichTextarea
                placeholder={
                    storefront.placeholder || "Write your document here!"
                }
                ref={editorRef}
                value={editorState}
                onChange={(e) => updateEditorState(e.target.value)}
                className="bg-white resize-none  h-[76vh] outline-none"
                // the styling MUST be done via the style prop, not tailwind
                style={{
                    width: "100%",
                }}
                disabled={isLoading}
                maxLength={MAX_EDITOR_LEN}
            >
                {(v) => {
                    // This is a similar problem to https://leetcode.com/problems/describe-the-painting/\

                    // The main thing we need to solve is: "is this span currently in the range of a suggestion"
                    // if it is, we need to underline it
                    // we can solve this using a line-sweep algorithm.
                    // the main idea is to iterate through all the suggestions and then insert the start/end of the ranges into two sets
                    // then we sort the merged sets and iterate from left to right. Every time we see a "start", we increment a counter
                    // and we decrement the counter everytime we see an "end"
                    // if the counter is positive, then we know that the span is inside a suggestion
                    // - in other words: a span is only underlined if at the START of the span, the counter is positive
                    //
                    // I'm not sure if this approach is faster than thedifference array solutions to the problem, but that problem is harder than this thing
                    // also, we don't want to allocate 10k array indexes cause this logic needs to run VERY frequently

                    const starts = new Map<number, SuggestionId[]>(); // we need the suggestionId instead of an number, so we can set the suggetionIdToRef map
                    const ends = new Map<number, number>();
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
                            ends.set(end, dEnd + 1);
                        } else {
                            ends.set(end, 1);
                        }
                    }
                    const allPoints = new Set([
                        ...starts.keys(),
                        ...ends.keys(),
                    ]);
                    allPoints.add(0);
                    const sortedPoints = Array.from(allPoints);
                    sortedPoints.sort((a, b) => a - b);

                    suggestionIdToRef.current = {}; // reset the map

                    let insideNumSuggestions = 0;
                    const res: JSX.Element[] = [];
                    for (let i = 0; i < sortedPoints.length - 1; i++) {
                        const start = sortedPoints[i];
                        const end = sortedPoints[i + 1];
                        const sSuggestions = starts.get(start);
                        const eAmount = ends.get(start); // yes. start. not end. this is not a typo
                        insideNumSuggestions += sSuggestions?.length ?? 0;
                        insideNumSuggestions -= eAmount ?? 0;

                        const range = newDocRange(start, end);
                        const isWithinSuggestion = insideNumSuggestions > 0;
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
                            for (const suggestionId of sSuggestions ?? []) {
                                suggestionIdToRef.current[suggestionId] = ref;
                            }

                            res.push(
                                <span
                                    ref={ref}
                                    key={res.length}
                                    className="border-[#189bf2] border-b-[2px]"
                                    style={style}
                                >
                                    {v.substring(start, end)}
                                </span>,
                            );
                        } else {
                            res.push(
                                <span key={res.length}>
                                    {v.substring(start, end)}
                                </span>,
                            );
                        }
                    }

                    // we need to append the (non-underlined) text from the last suggestion to the end of the string
                    if (sortedPoints[sortedPoints.length - 1] < v.length) {
                        res.push(
                            <span key={res.length}>
                                {v.substring(
                                    sortedPoints[sortedPoints.length - 1],
                                )}
                            </span>,
                        );
                    }

                    return res;
                }}
            </RichTextarea>
        </div>
    );
};
