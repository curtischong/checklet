import React from "react";
import { Suggestion, SuggestionRefs } from "./suggestionsTypes";
import css from "./suggestions.module.scss";
import { SuggestionCollapse } from "./suggestionCollapse";
import ZeroImage from "./ZeroState.svg";
import { BsSortDownAlt } from "react-icons/bs";
import { NoSuggestionMessage } from "./nosuggestionmessage";
import NoSuggestionsImage from "./NoSuggestionsState.svg";
import { mixpanelTrack } from "src/utils";
import { ContentBlock, EditorState, Modifier, SelectionState } from "draft-js";
import { CheckDescObj } from "@components/create-checker/CheckerTypes";
import { Tooltip } from "antd";
import { pluralize } from "@utils/strings";
// import { Tooltip } from "antd";

export type SuggestionsContainerProps = {
    suggestions: Suggestion[];
    refs: SuggestionRefs;
    activeKey: Suggestion | undefined;
    setActiveKey: (k: Suggestion | undefined) => void;
    editorState: EditorState;
    updateEditorState: (e: EditorState) => void;
    updateSortIdx: (idx: number) => void;
    checkDescObj: CheckDescObj;
    hasAnalyzedOnce: boolean;
};

export const SuggestionsContainer: React.FC<SuggestionsContainerProps> = (
    props: SuggestionsContainerProps,
) => {
    const {
        suggestions,
        refs,
        activeKey,
        setActiveKey,
        editorState,
        updateEditorState,
        updateSortIdx,
        hasAnalyzedOnce,
    } = props;

    const editorHasText = React.useMemo(
        () => editorState.getCurrentContent().hasText(),
        [editorState],
    );

    const onCollapseClick = (s: Suggestion) => {
        if (activeKey === s) {
            mixpanelTrack("Suggestion closed", {
                suggestion: s,
            });
            setActiveKey(undefined);
        } else {
            mixpanelTrack("Suggestion opened", {
                suggestion: s,
            });
            setActiveKey(s);
        }
    };

    const onReplaceClick = (s: Suggestion) => {
        const content = editorState.getCurrentContent();
        let start = s.highlightRanges[0].startPos;
        let currBlock: ContentBlock | undefined = content.getFirstBlock();
        while (currBlock != null && currBlock.getLength() < start) {
            start -= currBlock.getLength() + 1;
            currBlock = content.getBlockAfter(currBlock.getKey());
        }

        if (currBlock != null) {
            const selectionState = SelectionState.createEmpty(
                currBlock.getKey(),
            );

            const selection = selectionState.merge({
                anchorOffset: start,
                focusOffset:
                    start +
                    s.highlightRanges[0].endPos -
                    s.highlightRanges[0].startPos,
            });

            const newContent = Modifier.replaceText(
                editorState.getCurrentContent(),
                selection,
                s.replacementText,
            );
            updateEditorState(
                EditorState.push(editorState, newContent, "remove-range"),
            );
        }
    };

    const renderSuggestions = React.useCallback(() => {
        if (editorHasText) {
            if (suggestions.length > 0) {
                return suggestions.map((s: Suggestion, index: number) => {
                    return (
                        <SuggestionCollapse
                            key={index}
                            suggestion={s}
                            activeKey={activeKey}
                            onClick={() => onCollapseClick(s)}
                            onReplaceClick={() => onReplaceClick(s)}
                            ref={refs[s.id]}
                            checkDescObj={props.checkDescObj}
                        />
                    );
                });
            }

            if (hasAnalyzedOnce) {
                return (
                    <NoSuggestionMessage
                        imageSrc={NoSuggestionsImage.src}
                        header={"No issues found"}
                        content={
                            <>
                                <div className={css.noSuggestContent}>
                                    We checked your text and found no issues
                                    &#10084;
                                </div>
                            </>
                        }
                    />
                );
            } else {
                return (
                    <NoSuggestionMessage
                        imageSrc={NoSuggestionsImage.src}
                        header={"Looking Good!"}
                        content={
                            <>
                                <div className={css.noSuggestContent}>
                                    Click 'Check Document' to check for mistakes
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
                imageSrc={ZeroImage.src}
                header={"Nothing to check yet"}
                content={
                    <div className={css.zeroContent}>
                        Start writing or paste your resume to see Nautilus's
                        feedback.
                    </div>
                }
            />
        );
    }, [editorHasText, suggestions, activeKey]);

    return (
        <div className="col-span-2">
            <SuggestionsHeader
                suggestions={suggestions}
                updateSortIdx={updateSortIdx}
            />
            <div
                className="px-4"
                style={{ maxHeight: "calc(100vh - 61px)", overflow: "auto" }}
            >
                {renderSuggestions()}
            </div>
        </div>
    );
};

const SortIcon = (
    idx: number,
    tooltip: string,
    updateSortIdx: (idx: number) => void,
) => {
    return (
        <Tooltip title={tooltip}>
            <BsSortDownAlt
                className="ml-2"
                size={20}
                onClick={() => updateSortIdx(idx)}
            />
        </Tooltip>
    );
};

const SuggestionsHeader = ({
    suggestions,
    updateSortIdx,
}: {
    suggestions: Suggestion[];
    updateSortIdx: (idx: number) => void;
}) => {
    return (
        <div className="font-bold text-16 pb-4 pt-1 flex mt-10">
            {suggestions.length > 0 && (
                <div className="flex flex-row ml-8">
                    <div className="font-bold mr-1">{suggestions.length}</div>
                    <div className="text-12">
                        {pluralize("Suggestion", suggestions.length)}
                    </div>
                </div>
            )}
            <div className="flex ml-auto mr-1">
                {SortIcon(0, "Sort by text order", updateSortIdx)}
                {SortIcon(1, "Sort by category", updateSortIdx)}
            </div>
        </div>
    );
};
