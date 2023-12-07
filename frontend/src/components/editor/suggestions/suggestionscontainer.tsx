import React, { useCallback, useEffect, useRef } from "react";
import { SuggestionIdToRef } from "./suggestionsTypes";
import { SuggestionCard } from "./SuggestionCard";
import ZeroImage from "./ZeroState.svg";
import { BsSortDownAlt } from "react-icons/bs";
import { NoSuggestionMessage } from "./nosuggestionmessage";
import NoSuggestionsImage from "./NoSuggestionsState.svg";
import { mixpanelTrack } from "src/utils";
import { CheckDescObj } from "@components/create-checker/CheckerTypes";
import { Tooltip } from "antd";
import { pluralize } from "@utils/strings";
import { Suggestion } from "@api/ApiTypes";
import { SetState } from "@utils/types";

export type SuggestionsContainerProps = {
    suggestions: Suggestion[];
    activeSuggestion: Suggestion | undefined;
    setActiveSuggestion: SetState<Suggestion | undefined>;
    editorState: string;
    updateEditorState: (e: string) => void;
    updateSortIdx: (idx: number) => void;
    checkDescObj: CheckDescObj;
    hasAnalyzedOnce: boolean;
};

export const SuggestionsContainer: React.FC<SuggestionsContainerProps> = (
    props: SuggestionsContainerProps,
) => {
    const {
        suggestions,
        activeSuggestion,
        setActiveSuggestion,
        editorState,
        updateEditorState,
        updateSortIdx,
        hasAnalyzedOnce,
    } = props;

    const suggestionsContainerRef = useRef<HTMLDivElement>(null);

    const suggestionsRefs = useRef<SuggestionIdToRef>({});

    const onCollapseClick = useCallback(
        (s: Suggestion) => {
            if (activeSuggestion === s) {
                mixpanelTrack("Suggestion closed", {
                    suggestion: s,
                });
                setActiveSuggestion(undefined);
            } else {
                mixpanelTrack("Suggestion opened", {
                    suggestion: s,
                });
                setActiveSuggestion(s);
            }
        },
        [activeSuggestion, setActiveSuggestion],
    );

    const onReplaceClick = useCallback(
        (s: Suggestion) => {
            const newEditorState =
                editorState.slice(0, s.range.start) +
                s.editedText +
                editorState.slice(s.range.end);
            updateEditorState(newEditorState);
        },
        [editorState, updateEditorState],
    );

    useEffect(() => {
        if (activeSuggestion) {
            const ref = suggestionsRefs.current[activeSuggestion.suggestionId];
            // we cannot use scrollIntoView because there is a bug in its implementation in chrome
            // I even tried wrapping it in a requestAnimationFrame but it doesn't work
            // https://github.com/facebook/react/issues/23396
            if (ref.current) {
                const scrollHeight = ref.current.offsetTop;
                suggestionsContainerRef.current?.scrollTo({
                    left: 0,
                    top:
                        scrollHeight -
                        suggestionsContainerRef.current.offsetHeight / 2,
                    behavior: "smooth",
                });
            }
        }
    }, [activeSuggestion]);

    const renderSuggestions = React.useCallback(() => {
        suggestionsRefs.current = {}; // reset refs
        if (editorState !== "") {
            if (suggestions.length > 0) {
                return suggestions.map((s: Suggestion, index: number) => {
                    const ref = React.createRef<HTMLDivElement>();
                    suggestionsRefs.current[s.suggestionId] = ref;
                    return (
                        <SuggestionCard
                            key={index}
                            suggestion={s}
                            activeSuggestion={activeSuggestion}
                            onClick={() => onCollapseClick(s)}
                            onReplaceClick={() => onReplaceClick(s)}
                            checkDescObj={props.checkDescObj}
                            ref={ref}
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
                                <div className={"w-3/4"}>
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
                        header={"Ready to check?"}
                        content={
                            <>
                                <div className={"w-3/4"}>
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
                    <div className={"w-[70%]"}>
                        Start writing or paste your resume to see Nautilus's
                        feedback.
                    </div>
                }
            />
        );
    }, [editorState, suggestions, activeSuggestion]);

    return (
        <div className="col-span-2">
            <SuggestionsHeader
                suggestions={suggestions}
                updateSortIdx={updateSortIdx}
            />
            <div
                className="px-4"
                style={{ maxHeight: "calc(85vh)", overflow: "auto" }}
                ref={suggestionsContainerRef}
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
