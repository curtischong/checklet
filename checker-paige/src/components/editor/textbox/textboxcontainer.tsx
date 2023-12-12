import {
    Suggestion,
    SuggestionId,
    isWithinRange,
    newDocRange,
} from "@api/ApiTypes";
import { CheckerStorefront } from "@components/create-checker/CheckerTypes";
import { SuggestionIdToRef } from "@components/editor/suggestions/suggestionsTypes";
import { Ref, SetState } from "@utils/types";
import debounce from "lodash.debounce";
import * as pdfjs from "pdfjs-dist";
import React, {
    // createRef,
    useCallback,
    useEffect,
} from "react";
import { toast } from "react-toastify";
import { RichTextarea, RichTextareaHandle } from "rich-textarea";
import { MAX_EDITOR_LEN } from "src/constants";
import { mixpanelTrack } from "../../../utils";

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
        (suggestionId?: SuggestionId) => {
            if (!suggestionId) {
                return;
            }
            // PERF: try using a map, but since there's only so few suggestions, it might not be worth it
            const suggestion = suggestions.find((s) => {
                return s.suggestionId === suggestionId;
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
                    const allPoints = new Set([
                        ...starts.keys(),
                        ...ends.keys(),
                    ]);
                    allPoints.add(0);
                    const sortedPoints = Array.from(allPoints);
                    sortedPoints.sort((a, b) => a - b);

                    suggestionIdToRef.current = {}; // reset the map

                    const activeSuggestions = new Set<SuggestionId>();
                    const res: JSX.Element[] = [];
                    for (let i = 0; i < sortedPoints.length - 1; i++) {
                        const start = sortedPoints[i];
                        const end = sortedPoints[i + 1];
                        const sSuggestions = starts.get(start) ?? [];
                        const eSuggestions = ends.get(start) ?? []; // yes. start. not end. this is not a typo
                        sSuggestions.forEach((item) =>
                            activeSuggestions.add(item),
                        );
                        eSuggestions.forEach((item) =>
                            activeSuggestions.delete(item),
                        );

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
                            let clickSuggestionId: SuggestionId | undefined =
                                undefined;
                            for (const suggestionId of activeSuggestions) {
                                clickSuggestionId = suggestionId;
                                suggestionIdToRef.current[suggestionId] = ref;
                            }

                            res.push(
                                <span
                                    ref={ref}
                                    key={res.length}
                                    className="border-[#189bf2] border-b-[2px]"
                                    style={style}
                                    onClick={() =>
                                        handleUnderlineClicked(
                                            clickSuggestionId,
                                        )
                                    }
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
