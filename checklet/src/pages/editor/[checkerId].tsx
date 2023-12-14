import { Api } from "@api/apis";
import { CheckerStore } from "@components/CheckerStore";
import { CheckerStorefront } from "@components/create-checker/CheckerTypes";
import { Editor } from "@components/editor/Editor";
import { useClientContext } from "@utils/ClientContext";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const EditorPage: React.FC = () => {
    const router = useRouter();
    const { checkerId } = router.query;
    const [storefront, setStorefront] = React.useState<
        CheckerStorefront | undefined | "not found"
    >(undefined);
    const { user } = useClientContext();

    useEffect(() => {
        (async () => {
            const storefront = await Api.getCheckerStorefront(
                checkerId as string,
                user, // if you're not logged in, then don't pass in an ID token! The token is just used so you can see your private checkers
            );
            if (!storefront) {
                setStorefront("not found");
            } else {
                setStorefront(storefront);
            }
        })();
    }, [checkerId]); // if the checkerId changes, we need to re-fetch the storefront (this page technically doesn't reload, so we need to add it to the dep lsit)

    if (storefront === undefined) {
        return <div>Loading...</div>;
    } else if (storefront === "not found") {
        return (
            <div className="flex flex-col">
                <div className="mx-auto mt-20 text-2xl font-mackinac">
                    Checker not found.
                </div>
                <div className="mx-auto mt-4text-lg font-mackinac">
                    It may have been made private. You can find other checkers
                    below
                </div>
                <CheckerStore />
            </div>
        );
    } else {
        return <Editor storefront={storefront} />;
    }
};

export default EditorPage;
