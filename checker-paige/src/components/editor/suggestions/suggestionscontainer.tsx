import SuggestionCard from "@/components/editor/suggestions/SuggestionCard";
import { SortIcon } from "@/components/icons/SortIcon";
import { Suggestion } from "@api/ApiTypes";
import { CheckDescObj } from "@components/create-checker/CheckerTypes";
import CoolCheckie from "@public/checkies/cool.svg";
import PencilCheckie from "@public/checkies/pencil.svg";
import YayCheckie from "@public/checkies/yay.svg";
import { pluralize } from "@utils/strings";
import { SetState } from "@utils/types";
import { Tooltip } from "antd/lib";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { mixpanelTrack } from "../../../utils";
import { NoSuggestionMessage } from "./nosuggestionmessage";
import { SuggestionIdToRef } from "./suggestionsTypes";

export type SuggestionsContainerProps = {
    suggestions: Suggestion[];
    activeSuggestion: Suggestion | undefined;
    setActiveSuggestion: SetState<Suggestion | undefined>;
    editorState: string;
    acceptSuggestion: (suggestion: Suggestion, acceptedOption: string) => void;
    checkDescObj: CheckDescObj;
    hasModifiedTextAfterChecking: boolean;
};

export enum SortType {
    TextOrder,
    Category,
}

export const Sorters = {
    [SortType.TextOrder]: (a: Suggestion, b: Suggestion): number => {
        const res = a.range.start - b.range.start; // sort by order of appearance
        if (res !== 0) {
            return res;
        }
        return a.range.end - b.range.end; // if they have the same start, sort by end. We want the shorter suggestions to be first, so their underlines are visible
    },
    [SortType.Category]: (a: Suggestion, b: Suggestion): number =>
        a.checkId.localeCompare(b.checkId), // this second sort is just to sort by checkId (so checks that are the same are next to each other)
};

export const SuggestionsContainer: React.FC<SuggestionsContainerProps> = ({
    suggestions,
    activeSuggestion,
    setActiveSuggestion,
    editorState,
    acceptSuggestion,
    hasModifiedTextAfterChecking,
    checkDescObj,
}: SuggestionsContainerProps) => {
    const [sortedSuggestions, setSortedSuggestions] = useState<Suggestion[]>(
        [],
    );
    const suggestionsContainerRef = useRef<HTMLDivElement>(null);
    const suggestionsRefs = useRef<SuggestionIdToRef>({});

    const [sortType, setSortType] = useState(SortType.TextOrder);
    useEffect(() => {
        const sorted = [...suggestions].sort(Sorters[sortType]);
        setSortedSuggestions(sorted);
    }, [suggestions, sortType]);

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
            if (sortedSuggestions.length > 0) {
                return sortedSuggestions.map((s: Suggestion, index: number) => {
                    const ref = React.createRef<HTMLDivElement>();
                    suggestionsRefs.current[s.suggestionId] = ref;
                    return (
                        <SuggestionCard
                            key={index}
                            suggestion={s}
                            activeSuggestion={activeSuggestion}
                            onClick={() => onCollapseClick(s)}
                            onReplaceClick={(acceptedOption) =>
                                acceptSuggestion(s, acceptedOption)
                            }
                            checkDescObj={checkDescObj}
                            ref={ref}
                        />
                    );
                });
            }

            if (!hasModifiedTextAfterChecking) {
                return (
                    <NoSuggestionMessage
                        imageSrc={YayCheckie.src}
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
                        imageSrc={CoolCheckie.src}
                        header={"Ready to check?"}
                        content={
                            <>
                                <div className={"w-3/4"}>
                                    Click &apos;Check Document&apos; to check
                                    for mistakes &#128640;
                                </div>
                            </>
                        }
                    />
                );
            }
        }

        return (
            <NoSuggestionMessage
                imageSrc={PencilCheckie.src}
                header={"Nothing to check yet"}
                content={
                    <div className={"w-[70%]"}>
                        Start writing or paste your document.
                    </div>
                }
            />
        );
    }, [
        editorState,
        sortedSuggestions,
        hasModifiedTextAfterChecking,
        activeSuggestion,
        checkDescObj,
        onCollapseClick,
        acceptSuggestion,
    ]);

    return (
        <div className="col-span-2 mt-8">
            <SuggestionsHeader
                suggestions={suggestions}
                setSortType={setSortType}
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

const SortIconWithTooltip = (
    sortType: SortType,
    tooltip: string,
    setSortType: SetState<SortType>,
) => {
    return (
        <Tooltip title={tooltip}>
            {/* we need to wrap it in a div element so events are fired onhover and the Tooltip component can detect the hover */}
            <div>
                <SortIcon
                    className="ml-2 cursor-pointer"
                    onClick={() => setSortType(sortType)}
                />
            </div>
        </Tooltip>
    );
};

const SuggestionsHeader = ({
    suggestions,
    setSortType,
}: {
    suggestions: Suggestion[];
    setSortType: SetState<SortType>;
}) => {
    return (
        <div className="font-bold text-16 pb-4 pt-1 flex mt-10">
            {suggestions.length > 0 && (
                <>
                    <div className="flex flex-row ml-4">
                        <div className="font-bold mr-1">
                            {suggestions.length}
                        </div>
                        <div className="text-12">
                            {pluralize("Suggestion", suggestions.length)}
                        </div>
                    </div>
                </>
            )}
            <div className="flex ml-auto mt-1 mr-10 space-x-2">
                {SortIconWithTooltip(
                    SortType.TextOrder,
                    "Sort by text order",
                    setSortType,
                )}
                {SortIconWithTooltip(
                    SortType.Category,
                    "Sort by category",
                    setSortType,
                )}
            </div>
        </div>
    );
};
