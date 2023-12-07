import { Suggestion } from "@api/ApiTypes";
import { Api } from "@api/apis";
import { LoadingButton } from "@components/Button";
import {
    CheckDescObj,
    CheckerStorefront,
} from "@components/create-checker/CheckerTypes";
import {
    SortType,
    Sorters,
} from "@components/editor/suggestions/suggestionscontainer";
import { mixpanelTrack } from "@utils";
import { SetState } from "@utils/types";
import { Affix } from "antd";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { toast } from "react-toastify";

interface Props {
    setIsLoading: SetState<boolean>;
    isLoading: boolean;
    editorState: string;
    setHasAnalyzedOnce: SetState<boolean>;
    storefront: CheckerStorefront;
    setCheckDescObj: SetState<CheckDescObj>;
    setSuggestions: SetState<Suggestion[]>;
}

export const EditorHeader = ({
    setIsLoading,
    isLoading,
    editorState,
    setHasAnalyzedOnce,
    storefront,
    setCheckDescObj,
    setSuggestions,
}: Props): JSX.Element => {
    const router = useRouter();
    const checkDocument = useCallback(async (): Promise<void> => {
        if (isLoading) {
            return;
        }
        setIsLoading(true);
        const plaintext = editorState;

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

        const newSuggestions = response.suggestions;
        newSuggestions.sort(Sorters[SortType.TextOrder]);
        console.log("newSuggestions", newSuggestions);
        setCheckDescObj(response.checkDescs);
        setSuggestions(newSuggestions);
        // TODO: update the suggestionRefs with the actual ref of the card

        mixpanelTrack("Check Document Clicked", {
            "Number of suggestions generated": newSuggestions.length,
            Suggestions: newSuggestions,
            Input: plaintext,
        });
    }, [editorState, isLoading]);

    return (
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

                    <LoadingButton
                        onClick={checkDocument}
                        loading={isLoading}
                        className="h-9 float-right ml-32"
                        disabled={editorState === ""}
                    >
                        Check Document
                    </LoadingButton>
                </div>
            </div>
        </Affix>
    );
};
