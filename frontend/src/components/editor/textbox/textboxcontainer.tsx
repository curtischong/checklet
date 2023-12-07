import React, {
    // createRef,
    MutableRefObject,
    useCallback,
    useEffect,
} from "react";
import * as pdfjs from "pdfjs-dist";
import { mixpanelTrack } from "../../../utils";
import { SetState } from "@utils/types";
import {
    CheckDescObj,
    CheckerStorefront,
} from "@components/create-checker/CheckerTypes";
import { DocRange, Suggestion } from "@api/ApiTypes";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { LoadingButton } from "@components/Button";
import { Affix } from "antd";
import { Api } from "@api/apis";
import { RichTextarea } from "rich-textarea";
import { SuggestionIdToRef } from "@components/editor/suggestions/suggestionsTypes";
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
    updateSuggestions: (s: Suggestion[]) => void;
    updateActiveSuggestion: SetState<Suggestion | undefined>;
    sort: (a: Suggestion, b: Suggestion) => number;
    editorRef: MutableRefObject<any>;
    storefront: CheckerStorefront;
    setCheckDescObj: SetState<CheckDescObj>;
    setHasAnalyzedOnce: SetState<boolean>;
};

// const highlightColors = ["#CAE2F1", "#CCEAA5", "#DCBAE5", "#F5EBBB", "#DCBAB9"];

export const TextboxContainer = ({
    suggestions,
    editorState,
    activeSuggestion,
    updateEditorState,
    updateSuggestions,
    updateActiveSuggestion,
    sort,
    editorRef,
    storefront,
    setCheckDescObj,
    setHasAnalyzedOnce,
}: TextboxContainerProps): JSX.Element => {
    const [isLoading, setIsLoading] = React.useState(false);

    // these two are needed so we can scroll to the underline span when we click on a card
    // we need two maps since we only know:
    // 1) the blockLoc and the range together OR
    // 2) the rangeBlockLoc and the ref to the span
    // we don't know 1) and 2) at the same time. so we use two maps
    const suggestionIdToRef = React.useRef<SuggestionIdToRef>({});

    const router = useRouter();
    useEffect(() => {
        // TODO: load state from localstorage
        editorRef.current?.focus();
    }, []);

    useEffect(() => {
        if (activeSuggestion) {
            const ref =
                suggestionIdToRef.current[activeSuggestion.suggestionId];
            if (ref) {
                // we need to request animation frame cause otherwise, scrollIntoView will sometimes fail
                // https://github.com/facebook/react/issues/23396
                window.requestAnimationFrame(() => {
                    if (ref.current) {
                        ref.current.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                        });
                    }
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

    const checkDocument = useCallback(async (): Promise<void> => {
        if (isLoading) {
            return;
        }
        setIsLoading(true);
        const plaintext = editorState;

        const response = await Api.checkDoc(
            plaintext,
            router.query.checkerId as string,
        );
        setIsLoading(false);
        if (!response) {
            toast.error("Something went wrong, please try again later");
            return;
        }
        setHasAnalyzedOnce(true);
        suggestionIdToRef.current = {};
        // return;

        const newSuggestions = response.suggestions;
        console.log("newSuggestions", newSuggestions);
        newSuggestions.sort(sort);

        console.log("suggestions", newSuggestions);
        setCheckDescObj(response.checkDescs);
        updateSuggestions(newSuggestions);
        // TODO: update the suggestionRefs with the actual ref of the card

        mixpanelTrack("Check Document Clicked", {
            "Number of suggestions generated": newSuggestions.length,
            Suggestions: newSuggestions,
            Input: plaintext,
        });
    }, [editorState, isLoading]);

    return (
        <div
            className="textbox col-span-3"
            style={{ maxHeight: "calc(100vh - 80px)", overflow: "auto" }}
        >
            <Affix offsetTop={0}>
                <div className="bg-gradient-to-b from-white via-white to-transparent pt-4 pb-4 pl-4">
                    <div className="pb-6 flex flex-row">
                        {/* TODO: maybe put on the right side, above feedback */}
                        <div className="font-bold my-auto">
                            {storefront.objInfo.name}
                        </div>
                        <div className="font-bold my-auto ml-20">
                            {storefront.objInfo.desc}
                        </div>

                        <LoadingButton
                            onClick={checkDocument}
                            loading={isLoading}
                            className="h-9 float-right ml-32"
                        >
                            Check Document
                        </LoadingButton>
                    </div>
                </div>
            </Affix>

            <RichTextarea
                ref={editorRef}
                value={editorState}
                style={{ width: "600px", height: "400px" }}
                onChange={(e) => updateEditorState(e.target.value)}
            >
                {(v) => {
                    suggestionIdToRef.current = {}; // reset the map

                    const res: JSX.Element[] = [];
                    let lastCharIdx = 0;
                    for (const suggestion of suggestions) {
                        const range = suggestion.range;
                        if (lastCharIdx < range.start) {
                            res.push(
                                <span>
                                    {v.substring(lastCharIdx, range.start)}
                                </span>,
                            );
                        }

                        const style =
                            suggestion.range.start ===
                                activeSuggestion?.range.start &&
                            suggestion.range.end === activeSuggestion?.range.end
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
                                key={suggestion.suggestionId}
                            >
                                {v.substring(range.start, range.end)}
                            </span>,
                        );
                        lastCharIdx = range.end;
                    }
                    if (lastCharIdx < v.length) {
                        res.push(<span>{v.substring(lastCharIdx)}</span>);
                    }
                    return res;
                }}
            </RichTextarea>
        </div>
    );
};
