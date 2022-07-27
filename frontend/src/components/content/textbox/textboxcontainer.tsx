import React, { createRef, CSSProperties, MutableRefObject } from "react";
import {
    Editor,
    EditorState,
    CompositeDecorator,
    ContentState,
} from "draft-js";
import { Api } from "@api";
import { Button } from "antd";
import { Suggestion, SuggestionRefs } from "../suggestions/suggestionsTypes";
import { AccessCodeModal } from "./accessCodeModal";
import { getAccessCode, mixpanelTrack } from "../../../utils";
import { ContainerHeader } from "../containerHeader";
import { ExamplesModal } from "./examplesModal";

export type TextboxContainerProps = {
    suggestions: Suggestion[];
    editorState: EditorState;
    activeKey: Suggestion | undefined;
    updateEditorState: (e: EditorState) => void;
    updateSuggestions: (s: Suggestion[]) => void;
    updateCollapseKey: (k: Suggestion | undefined) => void;
    updateRefs: (s: SuggestionRefs) => void;
    refs: SuggestionRefs;
    editorRef: MutableRefObject<any>;
};

const highlightColors = ["#CAE2F1", "#CCEAA5", "#DCBAE5", "#F5EBBB", "#DCBAB9"];

export class TextboxContainer extends React.Component<
    TextboxContainerProps,
    {
        loading: boolean;
        isAccessCodeModalVisible: boolean;
        isExampleCodeModalVisible: boolean;
    }
> {
    constructor(props: TextboxContainerProps) {
        super(props);

        this.props.updateEditorState(
            EditorState.moveFocusToEnd(
                EditorState.createEmpty(this.decorator()),
            ),
        );

        this.state = {
            loading: false,
            isAccessCodeModalVisible: false,
            isExampleCodeModalVisible: false,
        };
        this.analyzeText = this.analyzeText.bind(this);
        this.handleStrategy = this.handleStrategy.bind(this);
    }

    componentDidUpdate = (prevProps: TextboxContainerProps): void => {
        if (!this.state.isAccessCodeModalVisible) {
            this.props.editorRef.current?.focus();
        }
        if (
            prevProps.editorState !== this.props.editorState &&
            prevProps.editorState.getCurrentContent().getPlainText() !==
                this.props.editorState.getCurrentContent().getPlainText()
        ) {
            this.analyzeText();
        }
    };

    decorator = () => {
        return new CompositeDecorator([
            {
                strategy: this.handleStrategy,
                component: (props: any) =>
                    this.HandleSpan(
                        props,
                        this.spanStyle,
                        this.handleUnderlineClicked,
                    ),
            },
        ]);
    };

    render() {
        return (
            <div
                className="textbox col-span-3"
                style={{ maxHeight: "calc(100vh - 80px)", overflow: "auto" }}
            >
                <ContainerHeader header={this.textboxHeader()} />
                <Editor
                    spellCheck={true}
                    editorState={this.props.editorState}
                    onChange={this.onChange}
                    placeholder="Type or paste your resume here"
                    ref={this.props.editorRef}
                />
            </div>
        );
    }

    textboxHeader() {
        return (
            <div className="flex pb-6">
                <div className="font-bold my-auto">Resume Feedback</div>
                <div
                    onClick={this.showAccessCodeModal}
                    className="italic nautilus-text-blue m-auto hover:underline"
                >
                    {" "}
                    Want an access code?{" "}
                </div>
                <AccessCodeModal
                    onClose={this.closeAccessCodeModal}
                    visible={this.state.isAccessCodeModalVisible}
                />
                {getAccessCode() === "admin" && (
                    <div
                        onClick={this.showExamplesModal}
                        className="italic nautilus-text-blue m-auto hover:underline"
                    >
                        {" "}
                        Examples
                    </div>
                )}

                <ExamplesModal
                    onClose={this.closeExamplesModal}
                    visible={this.state.isExampleCodeModalVisible}
                    onClick={this.handleExampleClicked}
                />

                <Button
                    style={{ width: "117px", height: "36px" }}
                    onClick={this.analyzeText}
                    loading={this.state.loading}
                    className={this.getButtonClasses()}
                >
                    Analyze
                </Button>
            </div>
        );
    }

    getButtonClasses = () => {
        let shared =
            "ml-auto mr-0 bg-transparent nautilus-text-blue h-[120px] py-1 border nautilus-border-blue rounded";
        if (this.state.loading) {
            shared += " disabled";
        } else {
            shared +=
                " hover:nautilus-blue hover:text-white hover:border-transparent";
        }
        return shared;
    };

    handleStrategy = (
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
        this.props.suggestions.forEach((suggestion: Suggestion) => {
            suggestion.highlightRanges.forEach((range) => {
                if (range.startPos > end || range.endPos < start) {
                    return;
                }

                const startPos = range.startPos - start;
                const endPos = range.endPos - start;
                callback(
                    Math.max(startPos, 0),
                    Math.min(contentBlock.getLength(), endPos),
                );
            });
        });
    };

    HandleSpan = (
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

    spanStyle = (props: any): CSSProperties => {
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

        if (
            startPos === result?.highlightRanges[0].startPos &&
            endPos === result?.highlightRanges[0].endPos
        ) {
            style.backgroundColor = "#DBEBFF";
            style.padding = "1.5px 0 1px";
            style.backgroundPosition = "center calc(100% + 2px)";
            style.backgroundClip = "text";
        }
        return style;
    };

    handleUnderlineClicked = (props: any) => {
        const contentState = props.contentState;

        let currBlock = contentState.getBlockForKey(props.blockKey);
        let start = 0;

        while (contentState.getBlockBefore(currBlock.getKey()) != null) {
            currBlock = contentState.getBlockBefore(currBlock.getKey());
            start += currBlock.getLength() + 1;
        }

        const startPos = props.start + start;
        const endPos = props.end + start;
        const key = startPos + "," + endPos + props.decoratedText;

        if (!(key in this.props.refs)) {
            console.log("could not find key: " + key);
        }

        const result = this.props.suggestions.find(
            (s) =>
                s.highlightRanges[0].endPos === endPos &&
                s.highlightRanges[0].startPos === startPos &&
                s.srcNautObj === props.decoratedText,
        );

        if (result != null) {
            this.props.updateCollapseKey(result);
        }

        setTimeout(() => {
            this.props.refs[key].current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        });
        mixpanelTrack("Underlined text selected", {
            suggestion: result,
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

    analyzeText = async () => {
        if (this.state.loading) {
            return;
        }
        this.setState({ loading: true });
        const plaintext = this.props.editorState
            .getCurrentContent()
            .getPlainText();

        const response = await Api.analyzeResume({ text: plaintext });

        const feedback = response.feedback;

        const feedbackRefs: SuggestionRefs = {};
        feedback.sort(
            (a, b) =>
                a.highlightRanges[0].startPos - b.highlightRanges[0].startPos,
        );

        feedback.forEach((f: Suggestion) => {
            const ref = createRef<HTMLDivElement>();
            if (f.srcNautObj.substring(0, 1) === "[") {
                f.srcNautObj = f.srcNautObj.substring(
                    1,
                    f.srcNautObj.length - 1,
                );
            }
            const key: string =
                f.highlightRanges[0].startPos +
                "," +
                f.highlightRanges[0].endPos +
                f.srcNautObj;
            feedbackRefs[key] = ref;
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

        mixpanelTrack("Analyze Button Clicked", {
            "Number of suggestions generated": feedback.length,
            Suggestions: feedback,
            Input: plaintext,
        });
        this.setState({ loading: false });

        if (
            this.props.editorState.getCurrentContent().getPlainText() !==
            plaintext
        ) {
            this.analyzeText();
        }
        return editor;
    };
}
