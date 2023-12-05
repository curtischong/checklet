import React, { useEffect } from "react";
import { Editor } from "@components/editor/Editor";
import { Api } from "@api/apis";
import { useRouter } from "next/router";
import { CheckerStore } from "@components/CheckerStore";
import { TextButton } from "@components/Button";
import { useClientContext } from "@utils/ClientContext";
import { CheckerStorefront } from "@components/create-checker/CheckerTypes";

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
                (await user?.getIdToken()) ?? undefined, // if you're not logged in, then don't pass in an ID token! The token is just used so you can see your private checkers
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
                <TextButton
                    className="fixed top-2 right-5"
                    onClick={() => {
                        const isLoggedOut = user === null;
                        if (isLoggedOut) {
                            router.push("/login");
                        } else {
                            router.push("/dashboard");
                        }
                    }}
                >
                    Create Your Own Checker
                </TextButton>
            </div>
        );
    } else {
        return <Editor storefront={storefront} />;
    }
};

export default EditorPage;
