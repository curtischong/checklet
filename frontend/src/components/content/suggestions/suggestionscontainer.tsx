import React from "react";
import classnames from "classnames";
import { Suggestion } from "./suggestionsTypes";
import css from "./suggestions.module.scss";
import { SuggestionCollapse } from "./suggestionCollapse";
import { NoSuggestionMessage } from "./nosuggestionmessage";
import ZeroImage from "./ZeroState.svg";
import NoSuggestionsImage from "./NoSuggestionsState.svg";
import { mixpanelTrack } from "src/utils";
import { ContainerHeader } from "../containerHeader";
import { ContentBlock, EditorState, Modifier, SelectionState } from "draft-js";

export type SuggestionsContainerProps = {
    suggestions: Suggestion[];
    refs: { [key: string]: any };
    activeKey: string;
    setActiveKey: (k: string) => void;
    editorState: EditorState;
    updateEditorState: (e: EditorState) => void;
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
    } = props;

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
        </div>
    );

    const onCollapseClick = (s: Suggestion) => {
        if (activeKey === s.id) {
            mixpanelTrack("Suggestion closed", {
                suggestion: s,
            });
            setActiveKey("");
        } else {
            mixpanelTrack("Suggestion opened", {
                suggestion: s,
            });
            setActiveKey(s.id);
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
                            index={index}
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
