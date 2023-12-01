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
    const [isLoading, setIsLoading] = React.useState(false);
    const [isExampleCodeModalVisible, setIsExampleCodeModalVisible] =
        React.useState(false);
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

    const router = useRouter();

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
        console.log(response);
        // return;

        const suggestions = response.suggestions;
        const feedbackRefs: SuggestionRefs = {};
        suggestions.sort(sort);

        console.log("suggestions", suggestions);
        setCheckDescObj(response.checkDescs);
        updateSuggestions(suggestions);
        updateRefs(feedbackRefs);
        let editor = editorState;

        const selectionState = editor.getSelection();
        const content = editor.getCurrentContent();

        editor = EditorState.createWithContent(content, decorator());

        updateEditorState(EditorState.forceSelection(editor, selectionState));

        mixpanelTrack("Check Document Clicked", {
            "Number of suggestions generated": suggestions.length,
            Suggestions: suggestions,
            Input: plaintext,
        });

        return editor;
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
                            {storefront.name}
                        </div>
                        <div className="font-bold my-auto ml-20">
                            {storefront.desc}
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
            />
        </div>
    );
};
