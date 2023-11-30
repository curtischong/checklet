import React, { useEffect } from "react";
import { Editor } from "@components/editor/Editor";
import { Api } from "@api/apis";
import { useRouter } from "next/router";
import { CheckerStore, CheckerStorefront } from "@components/CheckerStore";

const EditorPage: React.FC = () => {
    // TODO: check if checker exists
    const router = useRouter();
    const { checkerId } = router.query;
    const [storefront, setStorefront] = React.useState<
        CheckerStorefront | undefined | "not found"
    >(undefined);

    useEffect(() => {
        (async () => {
            const storefront = await Api.getCheckerStorefront(
                checkerId as string,
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
            <div>
                <div>
                    Checker not found. It may have been made private. You can
                    find other checkers below
                </div>
                <CheckerStore />
            </div>
        );
    } else {
        return <Editor storefront={storefront} />;
    }
};

export default EditorPage;
