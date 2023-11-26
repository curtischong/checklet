import React, { createRef, CSSProperties, MutableRefObject } from "react";
import {
    Editor,
    EditorState,
    CompositeDecorator,
    ContentState,
} from "draft-js";
import { Api } from "@api";
import { Button, Upload, UploadProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Suggestion, SuggestionRefs } from "../suggestions/suggestionsTypes";
import * as pdfjs from "pdfjs-dist";
import { getAccessCode, mixpanelTrack } from "../../../utils";
import { ContainerHeader } from "../containerHeader";
import { ExamplesModal } from "./examplesModal";
import "draft-js/dist/Draft.css";
// const PizZip = require("pizzip");
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import css from "./textboxcontainer.module.scss";
import classnames from "classnames";

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
};

const highlightColors = ["#CAE2F1", "#CCEAA5", "#DCBAE5", "#F5EBBB", "#DCBAB9"];

export class TextboxContainer extends React.Component<
    TextboxContainerProps,
    {
        loading: boolean;
        isAccessCodeModalVisible: boolean;
        isExampleCodeModalVisible: boolean;
        keysToRefs: any;
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
            keysToRefs: {},
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

    beforeFileUpload = (file: any) => {
        const reader = new FileReader();

        reader.onload = async (event: any) => {
            const content = event.target.result;
            const parseStrategy = this.getParseStrategy(file);
            const text = await parseStrategy(content);
            this.props.updateEditorState(
                EditorState.createWithContent(
                    ContentState.createFromText(text),
                    this.decorator(),
                ),
            );
        };
        reader.readAsBinaryString(file);

        return false;
    };

    uploadProps: UploadProps = {
        accept: ".pdf,.docx",
        beforeUpload: this.beforeFileUpload,
        showUploadList: false,
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

    getParseStrategy = (file: any) => {
        if (file.type === "application/pdf") {
            return async (content: any) => {
                const doc = pdfjs.getDocument({ data: content });
                return await doc.promise.then((pdf: any) => {
                    const maxPages = pdf._pdfInfo.numPages;
                    const countPromises: Promise<any>[] = [];
                    for (let i = 1; i <= maxPages; ++i) {
                        const page = pdf.getPage(i);
                        countPromises.push(
                            page.then((p: any) => {
                                const textContent = p.getTextContent();
                                return textContent.then((text: any) => {
                                    let result = "";
                                    let lastY = text.items[0] ?? -1;
                                    text.items.forEach(
                                        (item: any, itemIndex: any) => {
                                            if (item.transform[5] != lastY) {
                                                result += "\n";
                                                lastY = item.transform[5];
                                            }
                                            result += item.str;
                                        },
                                    );
                                    return result;
                                });
                            }),
                        );
                    }
                    return Promise.all(countPromises).then((texts) => {
                        const result = texts.join("");
                        return result;
                    });
                });
            };
        }

        return async (content: any) => {
            const zip = new PizZip(content);
            const doc = new Docxtemplater(zip);
            return doc.getFullText();
        };
    };

    textboxHeader() {
        return (
            <div className={classnames(css.textboxHeader, "pb-6")}>
                <div className="font-bold my-auto">Resume Feedback</div>
                {/* deprecated
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
                /> */}
                <Upload
                    className={classnames(css.upload)}
                    {...this.uploadProps}
                >
                    <Button
                        className={classnames(
                            this.getButtonClasses(),
                            css.uploadButton,
                        )}
                        icon={<UploadOutlined />}
                    >
                        Upload PDF
                    </Button>
                </Upload>

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
                    onClick={this.analyzeText}
                    loading={this.state.loading}
                    className={classnames(
                        this.getButtonClasses(),
                        css.analyzeButton,
                    )}
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
        const idx = this.state.keysToRefs[startPos + "," + endPos];

        if (idx === result?.id) {
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
