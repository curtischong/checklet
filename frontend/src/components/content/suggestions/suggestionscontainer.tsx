import React from "react";
import classnames from "classnames";
import { Suggestion, SuggestionRefs } from "./suggestionsTypes";
import css from "./suggestions.module.scss";
import { SuggestionCollapse } from "./suggestionCollapse";
import ZeroImage from "./ZeroState.svg";
import { BsSortDownAlt } from "react-icons/bs";
import { NoSuggestionMessage } from "./nosuggestionmessage";
import NoSuggestionsImage from "./NoSuggestionsState.svg";
import { mixpanelTrack } from "src/utils";
import { ContainerHeader } from "../containerHeader";
import { ContentBlock, EditorState, Modifier, SelectionState } from "draft-js";
import { Tooltip } from "antd";

export type SuggestionsContainerProps = {
    suggestions: Suggestion[];
    refs: SuggestionRefs;
    activeKey: Suggestion | undefined;
    setActiveKey: (k: Suggestion | undefined) => void;
    editorState: EditorState;
    updateEditorState: (e: EditorState) => void;
    updateSortIdx: (idx: number) => void;
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
    } = props;

    const SortIcon = (idx: number, tooltip: string) => {
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
    const editorHasText = React.useMemo(
        () => editorState.getCurrentContent().hasText(),
        [editorState],
    );

    const suggestionsHeader = (
        <div className="font-bold text-16 pb-4 pt-1 flex">
            {suggestions.length > 0 && (
                <div className={classnames(css.number)}>
                    {suggestions.length}
                </div>
            )}
            All Suggestions
            <div className="flex ml-auto mr-1">
                {SortIcon(0, "Sort by text order")}
                {SortIcon(1, "Sort by relevance")}
            </div>
        </div>
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
                            ref={
                                refs[
                                    s.highlightRanges[0].startPos +
                                        "," +
                                        s.highlightRanges[0].endPos +
                                        s.srcNautObj
                                ]
                            }
                        />
                    );
                });
            }

            return (
                <NoSuggestionMessage
                    imageSrc={NoSuggestionsImage.src}
                    header={"No issues found"}
                    content={
                        <>
                            <div className={css.noSuggestContent}>
                                Nautilus ran dozens of checks on your text and
                                found no resume issues.
                            </div>
                            <div>
                                Check back in when you're ready to write some
                                more.
                            </div>
                        </>
                    }
                />
            );
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
            <ContainerHeader header={suggestionsHeader} />
            <div
                className="px-4"
                style={{ maxHeight: "calc(100vh - 61px)", overflow: "auto" }}
            >
                {renderSuggestions()}
            </div>
        </div>
    );
};
