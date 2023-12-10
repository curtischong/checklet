import { Suggestion } from "@api/ApiTypes";
import { Api } from "@api/apis";
import { LoadingButton, NormalButton } from "@components/Button";
import {
    CheckBlueprint,
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
import { useCallback, useEffect, useState } from "react";
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
    const [onlyUseCheckBlueprint, setOnlyUseCheckBlueprint] = useState<
        CheckBlueprint | undefined
    >();

    const onlyUseCheckId = router.query.onlyUseCheckId as string;
    const checkerId = router.query.checkerId as string;

    const checkDocument = useCallback(async (): Promise<void> => {
        if (isLoading) {
            return;
        }
        setIsLoading(true);
        const plaintext = editorState;
        const response = await checkDocText(
            plaintext,
            checkerId,
            user,
            onlyUseCheckId,
        );
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

        mixpanelTrack("Check Document Clicked", {
            "Number of suggestions generated": newSuggestions.length,
            Suggestions: newSuggestions,
            Input: plaintext,
        });
    }, [editorState, isLoading]);

    useEffect(() => {
        (async () => {
            if (onlyUseCheckId && user) {
                const checkBlueprint = await Api.getCheckBlueprint(
                    onlyUseCheckId,
                    user,
                );
                if (!checkBlueprint) {
                    toast.error(
                        `couldn't find the checkBlueprint for onlyUseCheckId=${onlyUseCheckId}`,
                    );
                    return;
                }
                setOnlyUseCheckBlueprint(checkBlueprint);
            }
        })();
    }, []);

    return (
        <div>
            {/* <div className="bg-gradient-to-b from-[#fff0f1] via-[fff0f1] to-transparent pt-4"> */}
            <div className="flex flex-col pt-4">
                <div className="flex flex-row">
                    <div className=" text-3xl my-auto flex-grow">
                        {storefront.objInfo.name}
                    </div>
                    <div className="flex flex-col space-y-2">
                        <LoadingButton
                            onClick={checkDocument}
                            loading={isLoading}
                            className="h-9 mt-2"
                            disabled={editorState === ""}
                        >
                            Check Document
                        </LoadingButton>

                        {onlyUseCheckBlueprint && (
                            <NormalButton
                                className="py-[4px]"
                                onClick={() => {
                                    router.push({
                                        pathname: `/create/check/${onlyUseCheckId}`,
                                        query: {
                                            checkerId,
                                        },
                                    });
                                }}
                            >
                                Return to Check Editor
                            </NormalButton>
                        )}
                    </div>
                </div>
                <div className="text-md ">
                    {onlyUseCheckBlueprint ? (
                        <>
                            <p>
                                You are testing the check:{" "}
                                <span className="font-bold">
                                    {onlyUseCheckBlueprint.objInfo.name}
                                </span>
                            </p>
                        </>
                    ) : (
                        <p>{storefront.objInfo.desc}</p>
                    )}
                </div>
            </div>
            <hr className="w-full h-[1px] bg-black mb-4 mt-1" />
        </div>
    );
};
