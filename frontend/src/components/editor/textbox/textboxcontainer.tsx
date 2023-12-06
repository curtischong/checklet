import React, {
    // createRef,
    CSSProperties,
    MutableRefObject,
    useCallback,
    useEffect,
} from "react";
import {
    Editor,
    EditorState,
    CompositeDecorator,
    ContentState,
    ContentBlock,
} from "draft-js";
import {
    RangeToSuggestion,
    RangeToBlockLocation,
    BlockLocToUnderlineRef,
} from "../suggestions/suggestionsTypes";
import * as pdfjs from "pdfjs-dist";
import { mixpanelTrack } from "../../../utils";
import "draft-js/dist/Draft.css";
import { SetState } from "@utils/types";
import {
    CheckDescObj,
    CheckerStorefront,
} from "@components/create-checker/CheckerTypes";
import { Suggestion } from "@api/ApiTypes";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { ExamplesModal } from "@components/editor/textbox/examplesModal";
import { LoadingButton } from "@components/Button";
import { Affix } from "antd";
import { Api } from "@api/apis";
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
    editorState: EditorState;
    activeSuggestion: Suggestion | undefined;
    updateEditorState: (e: EditorState) => void;
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
    const [isExampleCodeModalVisible, setIsExampleCodeModalVisible] =
        React.useState(false);

    const rangeToSuggestion = React.useRef<RangeToSuggestion>({}); // really useful when we need to map decorator to the curresponding suggestion

    // these two are needed so we can scroll to the underline span when we click on a card
    // we need two maps since we only know:
    // 1) the blockLoc and the range together OR
    // 2) the rangeBlockLoc and the ref to the span
    // we don't know 1) and 2) at the same time. so we use two maps
    const rangeBlockLoc = React.useRef<RangeToBlockLocation>({});
    const underlineRef = React.useRef<BlockLocToUnderlineRef>({});

    const router = useRouter();
    useEffect(() => {
        // TODO: load state from localstorage
        updateEditorState(
            EditorState.moveFocusToEnd(EditorState.createEmpty(decorator())),
        );
        editorRef.current?.focus();
    }, []);

    useEffect(() => {
        if (activeSuggestion) {
            const blockLoc =
                rangeBlockLoc.current[
                    activeSuggestion.range.start +
                        "," +
                        activeSuggestion.range.end
                ];
            // DO NOT change where the cursor is. cause if htey click on the underline to make the active suggestion, their cursor will be elsewhere
            // sometimes these refs are outdated????
            // HWOEVER, the scroll into view wrks!
            const ref = underlineRef.current[blockLoc];
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
    }, [activeSuggestion, underlineRef.current]);

    // handles decorating the text
    const handleStrategy = useCallback(
        (
            contentBlock: ContentBlock,
            callback: (start: number, end: number) => void,
            contentState: ContentState,
        ) => {
            let currBlock = contentBlock;
            let start = 0;
            while (contentState.getBlockBefore(currBlock.getKey()) != null) {
                const currBlockRaw = contentState.getBlockBefore(
                    currBlock.getKey(),
                );
                if (currBlockRaw) {
                    currBlock = currBlockRaw;
                    start += currBlock.getLength() + 1;
                }
            }
            const contentBlockKey = contentBlock.getKey();

            const end = start + contentBlock.getLength();
            suggestions.forEach((suggestion: Suggestion) => {
                const rangeStart = suggestion.range.start;
                const rangeEnd = suggestion.range.end;
                if (rangeStart > end || rangeEnd < start) {
                    return;
                }
                const rangeKey = `${rangeStart},${rangeEnd}`;
                rangeToSuggestion.current[rangeKey] = suggestion;

                const startPos = rangeStart - start;
                const endPos = rangeEnd - start;
                rangeBlockLoc.current[rangeKey] = `${contentBlockKey}`;
                callback(
                    Math.max(startPos, 0),
                    Math.min(contentBlock.getLength(), endPos),
                );
                // suggestion.editOps.forEach((editOp) => {
                //     const range = editOp.range;
                //     if (range.start > end || range.end < start) {
                //         return;
                //     }
                //     rangeToSuggestion.current[range.start + "," + range.end] =
                //         suggestion;

                //     const startPos = range.start - start;
                //     const endPos = range.end - start;
                //     rangeBlockLoc.current[
                //         range.start + "," + range.end
                //     ] = `${contentBlockKey}`;

                //     callback(
                //         Math.max(startPos, 0),
                //         Math.min(contentBlock.getLength(), endPos),
                //     );
                // });
            });
        },
        [suggestions],
    );

    const HandleSpan = useCallback(
        (
            props: any,
            getStyle: (p: any) => CSSProperties,
            onClick: (p: any) => void,
        ): JSX.Element => {
            const ref = React.createRef<HTMLSpanElement>();
            underlineRef.current[props.blockKey] = ref; // it's ok to just use the blockKey since we are only using the underlineRef to scroll to the underline
            // (so it's ok if we have multiple underlines with the same blockKey)
            return (
                <span
                    style={getStyle(props)}
                    data-offset-key={props.offsetKey}
                    onClick={() => onClick(props)}
                    ref={ref}
                >
                    {props.children}
                </span>
            );
        },
        [],
    );

    const spanStyle = useCallback(
        (props: any): CSSProperties => {
            const style: CSSProperties = {
                borderBottom: "2px solid #189bf2",
            };
            const contentState: ContentState = props.contentState;

            let currBlock = contentState.getBlockForKey(props.blockKey);
            let start = 0;

            let rawCurrBlock = contentState.getBlockBefore(currBlock.getKey());
            while (rawCurrBlock !== undefined) {
                currBlock = rawCurrBlock;
                start += currBlock.getLength() + 1;
                rawCurrBlock = contentState.getBlockBefore(currBlock.getKey());
            }
            const startPos = props.start + start;
            const endPos = props.end + start;
            const suggestion =
                rangeToSuggestion.current[startPos + "," + endPos];

            if (suggestion?.suggestionId === activeSuggestion?.suggestionId) {
                style.backgroundColor = "#DBEBFF";
                style.padding = "1.5px 0 1px";
                style.backgroundPosition = "center calc(100% + 2px)";
                style.backgroundClip = "text";
            }
            return style;
        },
        [activeSuggestion, rangeToSuggestion.current],
    );

    const handleUnderlineClicked = useCallback(
        (props: any) => {
            const contentState = props.contentState;
            let currBlock = contentState.getBlockForKey(props.blockKey);
            let start = 0;

            while (contentState.getBlockBefore(currBlock.getKey()) != null) {
                currBlock = contentState.getBlockBefore(currBlock.getKey());
                start += currBlock.getLength() + 1;
            }

            const startPos = props.start + start;
            const endPos = props.end + start;

            const suggestion = suggestions.find((s) => {
                return s.range.start === startPos && s.range.end === endPos;
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

    // damn. decorator NEEDs to be udpated everytime the suggestions are updated
    // cause:
    // handleStrategy - needs to update the ranges to update
    // spanStyle - needs to know which suggestion we clicked on (is currently active)
    // handleUnderlineClicked - needs to know all the suggestions so it knows which suggestion to select
    const decorator = useCallback(() => {
        return new CompositeDecorator([
            {
                strategy: handleStrategy, // Tells DraftJS which ranges of text should be decorated (handles newlines in the ranges)
                // tells DraftJS how to actually render the component
                component: (props: any) => {
                    return HandleSpan(props, spanStyle, handleUnderlineClicked);
                },
            },
        ]);
    }, [handleStrategy, spanStyle, handleUnderlineClicked]);

    // used when we want to insert an example into the editor
    const handleExampleClicked = (text: string) => {
        updateEditorState(
            EditorState.moveFocusToEnd(
                EditorState.createWithContent(
                    ContentState.createFromText(text),
                    decorator(),
                ),
            ),
        );
        setIsExampleCodeModalVisible(false);
    };

    const checkDocument = useCallback(async (): Promise<
        EditorState | undefined
    > => {
        if (isLoading) {
            return;
        }
        setIsLoading(true);
        const plaintext = editorState.getCurrentContent().getPlainText();

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
        rangeToSuggestion.current = {};
        underlineRef.current = {};
        rangeBlockLoc.current = {};
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

    useEffect(() => {
        const selectionState = editorState.getSelection();
        const content = editorState.getCurrentContent();

        const newEditorState = EditorState.createWithContent(
            content,
            decorator(),
        );
        updateEditorState(
            EditorState.forceSelection(newEditorState, selectionState),
        );
    }, [decorator, activeSuggestion]);

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

                        <ExamplesModal
                            onClose={() => setIsExampleCodeModalVisible(false)}
                            visible={isExampleCodeModalVisible}
                            onClick={handleExampleClicked}
                        />

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

            <Editor
                spellCheck={true}
                editorState={editorState}
                onChange={updateEditorState}
                placeholder="Type or paste your resume here"
                ref={editorRef}
                stripPastedStyles={true}
            />
        </div>
    );
};
