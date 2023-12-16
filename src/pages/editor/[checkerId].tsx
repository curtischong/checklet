import { Api } from "@api/apis";
import { CheckerStore } from "@components/CheckerStore";
import { CheckerStorefront } from "@components/create-checker/CheckerTypes";
import { Editor } from "@components/editor/Editor";
import LoveChecklet from "@public/checklets/love.svg";
import PennyChecklet from "@public/checklets/penny.svg";
import SpacyChecklet from "@public/checklets/spacy.svg";
import { useClientContext } from "@utils/ClientContext";
import Image from "next/image";
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
                <div className="mx-auto mt-20 text-3xl font-bold font-mackinac">
                    Checker not found.
                </div>
                <div className="mx-auto mt-2">
                    It may have been made private. You can find other checkers
                    below
                </div>
                <CheckerStore />
                <Image
                    alt="LoveChecklet"
                    src={LoveChecklet.src}
                    width={200}
                    height={200}
                    className="h-[6rem] bottom-[15rem] right-[0%] md:right-[1%] absolute"
                />
                <Image
                    alt="PennyChecklet"
                    src={PennyChecklet.src}
                    width={200}
                    height={200}
                    className="h-[7rem] top-[10rem] right-[7%] sm:right-[10%] md:right-[15%] absolute"
                />
                <Image
                    alt="SpacyChecklet"
                    src={SpacyChecklet.src}
                    width={200}
                    height={200}
                    className="h-[8rem] top-32 left-[5%] absolute"
                />
            </div>
        );
    } else {
        return <Editor storefront={storefront} />;
    }
};

export default EditorPage;
