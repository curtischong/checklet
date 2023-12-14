import { Api } from "@api/apis";
import { NormalButton } from "@components/Button";
import {
    CheckBlueprint,
    CheckerStorefront,
} from "@components/create-checker/CheckerTypes";
import { useClientContext } from "@utils/ClientContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Props {
    storefront: CheckerStorefront;
}

export const EditorHeader = ({ storefront }: Props): JSX.Element => {
    const router = useRouter();
    const { user } = useClientContext();
    const [onlyUseCheckBlueprint, setOnlyUseCheckBlueprint] = useState<
        CheckBlueprint | undefined
    >();

    const onlyUseCheckId = router.query.onlyUseCheckId as string;
    const checkerId = router.query.checkerId as string;

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
            <div className="flex flex-col pt-4 mt-8">
                <div className="flex flex-row">
                    <div className=" text-3xl my-auto flex-grow">
                        {storefront.objInfo.name}
                    </div>
                    <div className="flex flex-col space-y-2">
                        {/* <LoadingButton
                            onClick={checkDocument}
                            loading={isLoading}
                            className="h-9 mt-2"
                            disabled={editorState === ""}
                        >
                            Check Document
                        </LoadingButton> */}

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
            <hr className="w-full h-[1px] bg-black mb-4 mt-1 border-none" />
        </div>
    );
};
