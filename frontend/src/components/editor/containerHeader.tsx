import { Affix } from "antd";
import classnames from "classnames";
import React, { createRef, useCallback } from "react";
import css from "./containerHeader.module.scss";
import { getAccessCode, mixpanelTrack } from "@utils";
import { ExamplesModal } from "@components/editor/textbox/examplesModal";
import { LoadingButton } from "@components/Button";
import { CompositeDecorator, ContentState, EditorState } from "draft-js";
import { Api } from "@api/apis";
import { useRouter } from "next/router";
import {
    Suggestion,
    SuggestionRefs,
} from "@components/editor/suggestions/suggestionsTypes";
import { CheckerStorefront } from "@components/CheckerStore";

export type ContainerHeaderProps = {
    editorState: EditorState;
    updateSuggestions: (s: Suggestion[]) => void;
    updateRefs: (s: SuggestionRefs) => void;
    updateEditorState: (e: EditorState) => void;
    decorator: () => CompositeDecorator;
    sort: (a: Suggestion, b: Suggestion) => number;
    storefront: CheckerStorefront;
};

export const ContainerHeader: React.FC<ContainerHeaderProps> = ({
    editorState,
    updateEditorState,
    decorator,
    sort,
    updateSuggestions,
    updateRefs,
    storefront,
}) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [isExampleCodeModalVisible, setIsExampleCodeModalVisible] =
        React.useState(false);
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
        // if (isLoading) {
        //     return;
        // }
        setIsLoading(true);
        const plaintext = editorState.getCurrentContent().getPlainText();

        const response = await Api.checkDoc(
            plaintext,
            router.query.checkerId as string,
        );
        console.log(response);
        return;

        const feedback = response.feedback;
        const feedbackRefs: SuggestionRefs = {};
        feedback.sort(sort);

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
        updateRefs(feedbackRefs);
        let editor = editorState;

        const selectionState = editor.getSelection();
        const content = editor.getCurrentContent();

        editor = EditorState.createWithContent(content, decorator());

        updateEditorState(EditorState.forceSelection(editor, selectionState));

        mixpanelTrack("Check Document Clicked", {
            "Number of suggestions generated": feedback.length,
            Suggestions: feedback,
            Input: plaintext,
        });
        setIsLoading(false);

        return editor;
    }, [editorState, isLoading]);

    return (
        <Affix offsetTop={0}>
            <div className={classnames(css.header)}>
                <div className="pb-6 flex flex-row">
                    {/* TODO: maybe put on the right side, above feedback */}
                    <div className="font-bold my-auto">{storefront.name}</div>
                    <div className="font-bold my-auto ml-20">
                        {storefront.desc}
                    </div>

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
                        // loading={isLoading}
                        loading={false}
                        className="h-9 float-right ml-32"
                    >
                        Check Document
                    </LoadingButton>
                </div>
            </div>
        </Affix>
    );
};
