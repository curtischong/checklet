import React, {
    createRef,
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
import { Api } from "@api/apis";
import { Suggestion, SuggestionRefs } from "../suggestions/suggestionsTypes";
import * as pdfjs from "pdfjs-dist";
import { mixpanelTrack } from "../../../utils";
import { ContainerHeader } from "../containerHeader";
import "draft-js/dist/Draft.css";
// const PizZip = require("pizzip");
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import css from "./textboxcontainer.module.scss";
import classnames from "classnames";
import { LoadingButton, NormalButton } from "@components/Button";

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
    updateRefs: (s: SuggestionRefs) => void;
    refs: SuggestionRefs;
    sort: (a: Suggestion, b: Suggestion) => number;
    editorRef: MutableRefObject<any>;
    checkerId: string;
};

const highlightColors = ["#CAE2F1", "#CCEAA5", "#DCBAE5", "#F5EBBB", "#DCBAB9"];

export const TextboxContainer = (props: TextboxContainerProps) => {
    // {
    //     loading: boolean;
    //     isAccessCodeModalVisible: boolean;
    //     isExampleCodeModalVisible: boolean;
    //     keysToRefs: any;
    //     checkerId: string;
    // }

    const [loading, setLoading] = React.useState(false);
    const [isAccessCodeModalVisible, setIsAccessCodeModalVisible] =
        React.useState(false);
    const [isExampleCodeModalVisible, setIsExampleCodeModalVisible] =
        React.useState(false);
    const [keysToRefs, setKeysToRefs] = React.useState<any>({});
    useEffect(() => {
        props.updateEditorState(
            EditorState.moveFocusToEnd(
                EditorState.createEmpty(this.decorator()),
            ),
        );

        // TODO?
        // this.checkDocument = this.checkDocument.bind(this);
        // this.handleStrategy = this.handleStrategy.bind(this);
    }, []);

    // TODO: checkdocument on update? actually we shouldn't implement this. they should just press check document
    // componentDidUpdate = (prevProps: TextboxContainerProps): void => {
    //     if (!this.state.isAccessCodeModalVisible) {
    //         this.props.editorRef.current?.focus();
    //     }
    //     if (
    //         prevProps.editorState !== this.props.editorState &&
    //         prevProps.editorState.getCurrentContent().getPlainText() !==
    //             this.props.editorState.getCurrentContent().getPlainText()
    //     ) {
    //         this.checkDocument();
    //     }
    // };

    const decorator = () => {
        return new CompositeDecorator([
            {
                strategy: this.handleStrategy,
                component: (props: any) =>
                    HandleSpan(props, spanStyle, handleUnderlineClicked),
            },
        ]);
    };

    // getButtonClasses = () => {
    //     let shared =
    //         "ml-auto mr-0 bg-transparent nautilus-text-blue h-[120px] py-1 border nautilus-border-blue rounded";
    //     if (this.state.loading) {
    //         shared += " disabled";
    //     } else {
    //         shared +=
    //             " hover:nautilus-blue hover:text-white hover:border-transparent";
    //     }
    //     return shared;
    // };

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
        this.props.suggestions.forEach(
            (suggestion: Suggestion, index: number) => {
                suggestion.highlightRanges.forEach((range) => {
                    if (range.startPos > end || range.endPos < start) {
                        return;
                    }

                    const startPos = range.startPos - start;
                    const endPos = range.endPos - start;
                    const keys = this.state.keysToRefs;
                    keys[range.startPos + "," + range.endPos] = index;
                    callback(
                        Math.max(startPos, 0),
                        Math.min(contentBlock.getLength(), endPos),
                    );
                });
            },
        );
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
        const result = this.props.activeKey;
        const idx = this.state.keysToRefs[startPos + "," + endPos];

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

        if (!(key in this.state.keysToRefs)) {
            console.log("could not find key: " + key);
        }

        // const result = this.props.suggestions.find(
        //     (s) =>
        //         s.highlightRanges[0].endPos === endPos &&
        //         s.highlightRanges[0].startPos === startPos,
        // );

        // if (result != null) {
        //     this.props.updateCollapseKey(result);
        // }

        const idx = this.state.keysToRefs[key];
        const sugg = this.props.suggestions[idx];
        this.props.updateCollapseKey(sugg);
        setTimeout(() => {
            this.props.refs[idx].current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        });
        mixpanelTrack("Underlined text selected", {
            suggestion: sugg,
        });
    };

    onChange = (editorState: any) => {
        this.props.updateEditorState(editorState);
    };

    showAccessCodeModal = () => {
        this.setState({ isAccessCodeModalVisible: true });
    };

    closeAccessCodeModal = () => {
        this.setState({ isAccessCodeModalVisible: false });
    };

    showExamplesModal = () => {
        this.setState({ isExampleCodeModalVisible: true });
    };

    closeExamplesModal = () => {
        this.setState({ isExampleCodeModalVisible: false });
    };

    handleExampleClicked = (text: string) => {
        this.props.updateEditorState(
            EditorState.moveFocusToEnd(
                EditorState.createWithContent(
                    ContentState.createFromText(text),
                    this.decorator(),
                ),
            ),
        );
        this.setState({
            isExampleCodeModalVisible: false,
        });
    };

    const checkDocument = useCallback(async (): Promise<
        EditorState | undefined
    > => {
        if (this.state.loading) {
            return;
        }
        this.setState({ loading: true });
        const plaintext = this.props.editorState
            .getCurrentContent()
            .getPlainText();

        const response = await Api.checkDoc({
            doc: plaintext,
            checkerId: this.props.checkerId,
        });

        const feedback = response.feedback;
        const feedbackRefs: SuggestionRefs = {};
        feedback.sort(this.props.sort);

        feedback.forEach((f: Suggestion, index: number) => {
            const ref = createRef<HTMLDivElement>();
            if (f.srcNautObj.substring(0, 1) === "[") {
                f.srcNautObj = f.srcNautObj.substring(
                    1,
                    f.srcNautObj.length - 1,
                );
            }
            f.id = index;
            feedbackRefs[index] = ref;
        });

        this.props.updateSuggestions(feedback);
        this.props.updateRefs(feedbackRefs);
        let editor = this.props.editorState;

        const selectionState = editor.getSelection();
        const content = editor.getCurrentContent();

        editor = EditorState.createWithContent(content, this.decorator());

        this.props.updateEditorState(
            EditorState.forceSelection(editor, selectionState),
        );

        mixpanelTrack("Check Document Clicked", {
            "Number of suggestions generated": feedback.length,
            Suggestions: feedback,
            Input: plaintext,
        });
        this.setState({ loading: false });

        if (
            this.props.editorState.getCurrentContent().getPlainText() !==
            plaintext
        ) {
            this.checkDocument();
        }
        return editor;
    }, []);

    return (
        <div
            className="textbox col-span-3"
            style={{ maxHeight: "calc(100vh - 80px)", overflow: "auto" }}
        >
            <ContainerHeader header={textboxHeader()} />
            <Editor
                spellCheck={true}
                editorState={this.props.editorState}
                onChange={this.onChange}
                placeholder="Type or paste your resume here"
                ref={this.props.editorRef}
            />
        </div>
    );
};
