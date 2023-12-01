import React, {
    // createRef,
    CSSProperties,
    MutableRefObject,
    // useCallback,
    useEffect,
} from "react";
import {
    Editor,
    EditorState,
    CompositeDecorator,
    ContentState,
} from "draft-js";
import { SuggestionRefs } from "../suggestions/suggestionsTypes";
import * as pdfjs from "pdfjs-dist";
import { mixpanelTrack } from "../../../utils";
import { ContainerHeader } from "../containerHeader";
import "draft-js/dist/Draft.css";
import { SetState } from "@utils/types";
import {
    CheckDescObj,
    CheckerStorefront,
} from "@components/create-checker/CheckerTypes";
import { Suggestion } from "@api/ApiTypes";
import { toast } from "react-toastify";
// const PizZip = require("pizzip");
// import Docxtemplater from "docxtemplater";
// import PizZip from "pizzip";
// import css from "./textboxcontainer.module.scss";
// import classnames from "classnames";
// import { LoadingButton, NormalButton } from "@components/Button";

// need same version with worker and pdfjs for it to work properly
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

/*
    TONE
    WORDING
    SIMPLICITY
    WHITESPACE
    WARNING
    */

export type TextboxContainerProps = {
    suggestions: Suggestion[];
    editorState: EditorState;
    activeKey: Suggestion | undefined;
    updateEditorState: (e: EditorState) => void;
    updateSuggestions: (s: Suggestion[]) => void;
    updateCollapseKey: (k: Suggestion | undefined) => void;
    updateRefs: SetState<SuggestionRefs>;
    refs: SuggestionRefs;
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
    activeKey,
    updateEditorState,
    updateSuggestions,
    updateCollapseKey,
    updateRefs,
    refs,
    sort,
    editorRef,
    storefront,
    setCheckDescObj,
    setHasAnalyzedOnce,
}: TextboxContainerProps): JSX.Element => {
    // {
    //     loading: boolean;
    //     isAccessCodeModalVisible: boolean;
    //     isExampleCodeModalVisible: boolean;
    //     keysToRefs: any;
    //     checkerId: string;
    // }

    const [keysToRefs, setKeysToRefs] = React.useState<any>({});
    useEffect(() => {
        updateEditorState(
            EditorState.moveFocusToEnd(EditorState.createEmpty(decorator())),
        );
        // this.props.editorRef.current?.focus();

        // TODO?
        // this.checkDocument = this.checkDocument.bind(this);
        // this.handleStrategy = this.handleStrategy.bind(this);
    }, []);

    const decorator = () => {
        return new CompositeDecorator([
            {
                strategy: handleStrategy,
                component: (props: any) =>
                    HandleSpan(props, spanStyle, handleUnderlineClicked),
            },
        ]);
    };

    // handles decorating the text
    const handleStrategy = (
        contentBlock: any,
        callback: any,
        contentState: ContentState,
    ) => {
        let currBlock = contentBlock;
        let start = 0;
        while (contentState.getBlockBefore(currBlock.getKey()) != null) {
            currBlock = contentState.getBlockBefore(currBlock.getKey());
            start += currBlock.getLength() + 1;
        }

        const end = start + contentBlock.getLength();
        suggestions.forEach((suggestion: Suggestion, index: number) => {
            suggestion.editOps.forEach((editOp) => {
                const range = editOp.range;
                if (range.start > end || range.end < start) {
                    return;
                }

                const startPos = range.start - start;
                const endPos = range.end - start;
                keysToRefs[range.start + "," + range.end] = index;
                callback(
                    Math.max(startPos, 0),
                    Math.min(contentBlock.getLength(), endPos),
                );
            });
        });
    };

    const HandleSpan = (
        props: any,
        getStyle: (p: any) => CSSProperties,
        onClick: (p: any) => void,
    ) => {
        return (
            <span
                style={getStyle(props)}
                data-offset-key={props.offsetKey}
                onClick={() => onClick(props)}
            >
                {props.children}
            </span>
        );
    };

    const spanStyle = (props: any): CSSProperties => {
        const style: CSSProperties = {
            borderBottom: "2px solid #4F71D9",
        };
        const contentState = props.contentState;

        let currBlock = contentState.getBlockForKey(props.blockKey);
        let start = 0;

        while (contentState.getBlockBefore(currBlock.getKey()) != null) {
            currBlock = contentState.getBlockBefore(currBlock.getKey());
            start += currBlock.getLength() + 1;
        }
        const startPos = props.start + start;
        const endPos = props.end + start;
        const result = activeKey;
        const idx = keysToRefs[startPos + "," + endPos];

        if (idx === result?.id) {
            style.backgroundColor = "#DBEBFF";
            style.padding = "1.5px 0 1px";
            style.backgroundPosition = "center calc(100% + 2px)";
            style.backgroundClip = "text";
        }
        return style;
    };

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
        const key = startPos + "," + endPos;

        if (!(key in keysToRefs)) {
            toast.error("Could not find key corresponding suggestion");
            return;
        }

        // const result = this.props.suggestions.find(
        //     (s) =>
        //         s.highlightRanges[0].endPos === endPos &&
        //         s.highlightRanges[0].startPos === startPos,
        // );

        // if (result != null) {
        //     this.props.updateCollapseKey(result);
        // }

        const idx = keysToRefs[key];
        const sugg = suggestions[idx];
        updateCollapseKey(sugg);
        setTimeout(() => {
            refs[idx].current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        });
        mixpanelTrack("Underlined text selected", {
            suggestion: sugg,
        });
    };

    return (
        <div
            className="textbox col-span-3"
            style={{ maxHeight: "calc(100vh - 80px)", overflow: "auto" }}
        >
            <ContainerHeader
                editorState={editorState}
                updateEditorState={updateEditorState}
                decorator={decorator}
                sort={sort}
                updateRefs={updateRefs}
                updateSuggestions={updateSuggestions}
                storefront={storefront}
                setCheckDescObj={setCheckDescObj}
                setHasAnalyzedOnce={setHasAnalyzedOnce}
            />
            <Editor
                spellCheck={true}
                editorState={editorState}
                onChange={updateEditorState}
                placeholder="Type or paste your resume here"
                ref={editorRef}
            />
        </div>
    );
};
