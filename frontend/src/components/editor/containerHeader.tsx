import { Affix } from "antd";
import classnames from "classnames";
import React, { ReactNode, createRef, useCallback } from "react";
import css from "./containerHeader.module.scss";
import { getAccessCode, mixpanelTrack } from "@utils";
import { ExamplesModal } from "@components/editor/textbox/examplesModal";
import { LoadingButton } from "@components/Button";
import { CompositeDecorator, ContentState, EditorState } from "draft-js";
import { Api } from "@api/apis";
import { useRouter } from "next/router";
import { Suggestion, SuggestionRefs } from "@components/editor/suggestions/suggestionsTypes";

export type ContainerHeaderProps = {
    editorState: EditorState;
    updateEditorState: (e: EditorState) => void;
    decorator: () => CompositeDecorator;
};

export const ContainerHeader: React.FC<ContainerHeaderProps> = ({editorState, updateEditorState, decorator}
) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [isExampleCodeModalVisible, setIsExampleCodeModalVisible] = React.useState(false);
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
        const plaintext = editorState
            .getCurrentContent()
            .getPlainText();

        const response = await Api.checkDoc({
            doc: plaintext,
            checkerId: router.query.checkerId as string
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

        updateSuggestions(feedback);
        this.props.updateRefs(feedbackRefs);
        let editor = editorState;

        const selectionState = editor.getSelection();
        const content = editor.getCurrentContent();

        editor = EditorState.createWithContent(content, this.decorator());

        updateEditorState(
            EditorState.forceSelection(editor, selectionState),
        );

        mixpanelTrack("Check Document Clicked", {
            "Number of suggestions generated": feedback.length,
            Suggestions: feedback,
            Input: plaintext,
        });
        setIsLoading(false);

        if (
            editorState.getCurrentContent().getPlainText() !==
            plaintext
        ) {
            this.checkDocument();
        }
        return editor;
    }, []);

    return (
        <Affix offsetTop={0}>
            <div className={classnames(css.header)}>

            <div className="pb-6 flex flex-row">
                <div className="font-bold my-auto">Checker Name</div>
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

                {getAccessCode() === "admin" && (
                    <div
                        onClick={() => setIsExampleCodeModalVisible(true)}
                        className="italic nautilus-text-blue m-auto hover:underline"
                    >
                        {" "}
                        Examples
                    </div>
                )}

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
        );
    };

        </Affix>
    );
};
