import React, {
    // createRef,
    useCallback,
    useEffect,
    useRef,
} from "react";
import * as pdfjs from "pdfjs-dist";
import { mixpanelTrack } from "../../../utils";
import { SetState } from "@utils/types";
import { DocRange, Suggestion, isWithinRange } from "@api/ApiTypes";
import { toast } from "react-toastify";
import { RichTextarea, RichTextareaHandle } from "rich-textarea";
import { SuggestionIdToRef } from "@components/editor/suggestions/suggestionsTypes";
import debounce from "lodash.debounce";
import { MAX_EDITOR_LEN } from "src/constants";
// const PizZip = require("pizzip");
// import Docxtemplater from "docxtemplater";
// import PizZip from "pizzip";
// import css from "./textboxcontainer.module.scss";
// import classnames from "classnames";
// import { LoadingButton, NormalButton } from "@components/Button";

// need same version with worker and pdfjs for it to work properly
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export type TextboxContainerProps = {
    suggestions: Suggestion[];
    editorState: string;
    activeSuggestion: Suggestion | undefined;
    updateEditorState: (e: string) => void;
    updateActiveSuggestion: SetState<Suggestion | undefined>;
    isLoading: boolean;
};

// const highlightColors = ["#CAE2F1", "#CCEAA5", "#DCBAE5", "#F5EBBB", "#DCBAB9"];

export const TextboxContainer = ({
    suggestions,
    editorState,
    activeSuggestion,
    updateEditorState,
    updateActiveSuggestion,
    isLoading,
}: TextboxContainerProps): JSX.Element => {
    // these two are needed so we can scroll to the underline span when we click on a card
    // we need two maps since we only know:
    // 1) the blockLoc and the range together OR
    // 2) the rangeBlockLoc and the ref to the span
    // we don't know 1) and 2) at the same time. so we use two maps
    const suggestionIdToRef = React.useRef<SuggestionIdToRef>({});
    const editorRef = useRef<RichTextareaHandle | null>(null);

    useEffect(() => {
        // TODO: load state from localstorage
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
                    suggestionIdToRef.current = {}; // reset the map

                    const res: JSX.Element[] = [];
                    let lastCharIdx = 0;

                    // basically, every time we see a suggestion, we render it as an underline
                    // the res array just tracks sections of text that are underlines and NOT underlined
                    for (let i = 0; i < suggestions.length; i++) {
                        const suggestion = suggestions[i];
                        const range = suggestion.range;
                        if (lastCharIdx < range.start) {
                            res.push(
                                <span key={2 * i}>
                                    {v.substring(lastCharIdx, range.start)}
                                </span>,
                            );
                            lastCharIdx = range.start;
                        }

                        const isInActiveSuggestion =
                            activeSuggestion &&
                            isWithinRange(range, activeSuggestion.range);

                        const style = isInActiveSuggestion
                            ? {
                                  backgroundColor: "#DBEBFF",
                              }
                            : {};

                        const ref = React.createRef<HTMLSpanElement>();
                        suggestionIdToRef.current[suggestion.suggestionId] =
                            ref;

                        res.push(
                            <span
                                ref={ref}
                                className="border-[#189bf2] border-b-[2px]"
                                style={style}
                                onClick={() => handleUnderlineClicked(range)}
                                key={2 * i + 1}
                            >
                                {v.substring(lastCharIdx, range.end)}
                            </span>,
                        );
                        lastCharIdx = range.end;
                    }
                    if (lastCharIdx < v.length) {
                        res.push(
                            <span key={2 * suggestions.length}>
                                {v.substring(lastCharIdx)}
                            </span>,
                        );
                    }
                    return res;
                }}
            </RichTextarea>
        </div>
    );
};
