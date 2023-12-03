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
    ContentBlock,
} from "draft-js";
import {
    RangeToSuggestion,
    RangeToBlockLocation,
    BlockLocToUnderlineRef,
} from "../suggestions/suggestionsTypes";
import * as pdfjs from "pdfjs-dist";
import { mixpanelTrack } from "../../../utils";
import "draft-js/dist/Draft.css";
import { SetState } from "@utils/types";
import {
    CheckDescObj,
    CheckerStorefront,
} from "@components/create-checker/CheckerTypes";
import { Suggestion } from "@api/ApiTypes";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
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

export type TextboxContainerProps = {
    suggestions: Suggestion[];
    editorState: EditorState;
    activeSuggestion: Suggestion | undefined;
    updateEditorState: (e: EditorState) => void;
    updateSuggestions: (s: Suggestion[]) => void;
    updateActiveSuggestion: SetState<Suggestion | undefined>;
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
    activeSuggestion,
    updateEditorState,
    updateSuggestions,
    updateActiveSuggestion,
    sort,
    editorRef,
    storefront,
    setCheckDescObj,
    setHasAnalyzedOnce,
}: TextboxContainerProps): JSX.Element => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [isExampleCodeModalVisible, setIsExampleCodeModalVisible] =
        React.useState(false);

    const rangeToSuggestion = React.useRef<RangeToSuggestion>({}); // really useful when we need to map decorator to the curresponding suggestion

    // these two are needed so we can scroll to the underline span when we click on a card
    // we need two maps since we only know:
    // 1) the blockLoc and the range together OR
    // 2) the rangeBlockLoc and the ref to the span
    // we don't know 1) and 2) at the same time. so we use two maps
    const rangeBlockLoc = React.useRef<RangeToBlockLocation>({});
    const underlineRef = React.useRef<BlockLocToUnderlineRef>({});

    const router = useRouter();
    useEffect(() => {
        // TODO: load state from localstorage
        updateEditorState(
            // no need to create the decorator at the start. cause there are no suggestions! (unless we load from localstorage)
            EditorState.moveFocusToEnd(EditorState.createEmpty()),
        );
        editorRef.current?.focus();
    }, []);

    useEffect(() => {
        if (activeSuggestion) {
            const blockLoc =
                rangeBlockLoc.current[
                    activeSuggestion.range.start +
                        "," +
                        activeSuggestion.range.end
                ];
            // DO NOT change where the cursor is. cause if htey click on the underline to make the active suggestion, their cursor will be elsewhere
            // sometimes these refs are outdated????
            // HWOEVER, the scroll into view wrks!
            const ref = underlineRef.current[blockLoc];
            if (ref) {
                // we need to request animation frame cause otherwise, scrollIntoView will sometimes fail
                // https://github.com/facebook/react/issues/23396
                window.requestAnimationFrame(() => {
                    if (ref.current) {
                        ref.current.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                        });
                    }
                });
            }
        }
    }, [activeSuggestion, underlineRef.current]);

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
        rangeToSuggestion.current = {};
        underlineRef.current = {};
        rangeBlockLoc.current = {};
        // return;

        const newSuggestions = response.suggestions;
        console.log("newSuggestions", newSuggestions);
        newSuggestions.sort(sort);

        console.log("suggestions", newSuggestions);
        setCheckDescObj(response.checkDescs);
        updateSuggestions(newSuggestions);
        // TODO: update the suggestionRefs with the actual ref of the card

        mixpanelTrack("Check Document Clicked", {
            "Number of suggestions generated": newSuggestions.length,
            Suggestions: newSuggestions,
            Input: plaintext,
        });
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
                            {storefront.objInfo.name}
                        </div>
                        <div className="font-bold my-auto ml-20">
                            {storefront.objInfo.desc}
                        </div>

                        {/* <ExamplesModal
                            onClose={() => setIsExampleCodeModalVisible(false)}
                            visible={isExampleCodeModalVisible}
                            onClick={handleExampleClicked}
                        /> */}

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
                stripPastedStyles={true}
            />
        </div>
    );
};
