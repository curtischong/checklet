import { Suggestion } from "@api/ApiTypes";
import {
    BlockLocToUnderlineRef,
    RangeToBlockLocation,
    RangeToSuggestion,
} from "@components/editor/suggestions/suggestionsTypes";
import { mixpanelTrack } from "@utils";
import { SetState } from "@utils/types";
import { CompositeDecorator, ContentBlock, ContentState } from "draft-js";
import React from "react";
import { CSSProperties } from "react";
import { toast } from "react-toastify";

// handles decorating the text
const getHandleStrategy = (
    suggestions: Suggestion[],
    rangeToSuggestion: RangeToSuggestion,
    rangeBlockLoc: RangeToBlockLocation,
) => {
    const strategy = (
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

        // TODO: replace this with a binary search
        const end = start + contentBlock.getLength();
        suggestions.forEach((suggestion: Suggestion) => {
            const rangeStart = suggestion.range.start;
            const rangeEnd = suggestion.range.end;
            if (rangeStart > end || rangeEnd < start) {
                return;
            }
            const rangeKey = `${rangeStart},${rangeEnd}`;
            rangeToSuggestion[rangeKey] = suggestion;

            const startPos = rangeStart - start;
            const endPos = rangeEnd - start;
            rangeBlockLoc[rangeKey] = `${contentBlockKey}`;
            callback(
                Math.max(startPos, 0),
                Math.min(contentBlock.getLength(), endPos),
            );
        });
    };
    return strategy;
};

// only call this once at the start
const getHandleSpan = (underlineRef: BlockLocToUnderlineRef) => {
    const HandleSpan = (
        props: any,
        getStyle: (p: any) => CSSProperties,
        onClick: (p: any) => void,
    ): JSX.Element => {
        const ref = React.createRef<HTMLSpanElement>();
        underlineRef[props.blockKey] = ref; // it's ok to just use the blockKey since we are only using the underlineRef to scroll to the underline
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
    };
    return HandleSpan;
};

const getSpanStyle = (
    rangeToSuggestion: RangeToSuggestion,
    activeSuggestion: Suggestion | undefined,
) => {
    const spanStyle = (props: any): CSSProperties => {
        const style: CSSProperties = {
            borderBottom: "2px solid #4F71D9",
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
        const suggestion = rangeToSuggestion[startPos + "," + endPos];

        if (suggestion?.suggestionId === activeSuggestion?.suggestionId) {
            style.backgroundColor = "#DBEBFF";
            style.padding = "1.5px 0 1px";
            style.backgroundPosition = "center calc(100% + 2px)";
            style.backgroundClip = "text";
        }
        return style;
    };
    // [activeSuggestion, rangeToSuggestion.current],
    return spanStyle;
};

// TODO: I shoudl only initialize this once at the start. it hsould just return the startPos and endPos
// then the code above could just use the startPos and endPos to get the suggestion
const getHandleUnderlineClicked = (
    suggestions: Suggestion[],
    updateActiveSuggestion: SetState<Suggestion | undefined>,
) => {
    const handleUnderlineClicked = (props: any) => {
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

        // TODO: we need to redraw the thing cause the active suggestion changed :/
        updateActiveSuggestion(suggestion);
        mixpanelTrack("Underlined text selected", {
            suggestion,
        });
    };
    return handleUnderlineClicked;
    // [suggestions],
};

// damn. decorator NEEDs to be udpated everytime the suggestions are updated
// cause:
// handleStrategy - needs to update the ranges to update
// spanStyle - needs to know which suggestion we clicked on (is currently active)
// handleUnderlineClicked - needs to know all the suggestions so it knows which suggestion to select
export const getDecorator = (
    suggestions: Suggestion[],
    updateActiveSuggestion: SetState<Suggestion | undefined>,
    activeSuggestion: Suggestion | undefined,
): CompositeDecorator => {
    const rangeToSuggestion: RangeToSuggestion = {};
    const rangeBlockLoc: RangeToBlockLocation = {};
    const underlineRef: BlockLocToUnderlineRef = {};

    const spanStyle = getSpanStyle(rangeToSuggestion, activeSuggestion);
    const handleUnderlineClicked = getHandleUnderlineClicked(
        suggestions,
        updateActiveSuggestion,
    );
    const handleStrategy = getHandleStrategy(
        suggestions,
        rangeToSuggestion,
        rangeBlockLoc,
    ); // Tells DraftJS which ranges of text should be decorated (handles newlines in the ranges)

    return new CompositeDecorator([
        {
            strategy: handleStrategy,
            // tells DraftJS how to actually render the component
            component: (props: any) => {
                return getHandleSpan(underlineRef)(
                    props,
                    spanStyle,
                    handleUnderlineClicked,
                );
            },
        },
    ]);
};
