import { Suggestion } from "@api/ApiTypes";
import { LoadingButton } from "@components/Button";
import {
    CheckDescObj,
    CheckerStorefront,
} from "@components/create-checker/CheckerTypes";
import { checkDocText } from "@components/editor/checkDoc";
import {
    SortType,
    Sorters,
} from "@components/editor/suggestions/suggestionscontainer";
import { mixpanelTrack } from "@utils";
import { useClientContext } from "@utils/ClientContext";
import { SetState } from "@utils/types";
import { Affix } from "antd";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { toast } from "react-toastify";

interface Props {
    setIsLoading: SetState<boolean>;
    isLoading: boolean;
    editorState: string;
    setHasModifiedTextAfterChecking: SetState<boolean>;
    storefront: CheckerStorefront;
    setCheckDescObj: SetState<CheckDescObj>;
    setSuggestions: SetState<Suggestion[]>;
}

export const EditorHeader = ({
    setIsLoading,
    isLoading,
    editorState,
    setHasModifiedTextAfterChecking,
    storefront,
    setCheckDescObj,
    setSuggestions,
}: Props): JSX.Element => {
    const router = useRouter();
    const { user } = useClientContext();
    const checkDocument = useCallback(async (): Promise<void> => {
        if (isLoading) {
            return;
        }
        setIsLoading(true);
        const plaintext = editorState;
        const checkerId = router.query.checkerId as string;
        const response = await checkDocText(plaintext, checkerId, user);
        setIsLoading(false);
        if (!response) {
            toast.error("Something went wrong, please try again later");
            return;
        }
        setHasModifiedTextAfterChecking(false);

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
            {/* <div className="bg-gradient-to-b from-[#fff0f1] via-[fff0f1] to-transparent pt-4"> */}
            <div className="flex flex-col pt-4">
                {/* TODO: maybe put on the right side, above feedback */}
                <div className="flex flex-row">
                    <div className=" text-3xl my-auto flex-grow">
                        {storefront.objInfo.name}
                    </div>
                    <LoadingButton
                        onClick={checkDocument}
                        loading={isLoading}
                        className="h-9 mt-2"
                        disabled={editorState === ""}
                    >
                        Check Document
                    </LoadingButton>
                </div>
                <div className="text-md ">{storefront.objInfo.desc}</div>
            </div>
            <hr className="w-full h-[1px] bg-black mb-4 mt-1" />
        </Affix>
    );
};
