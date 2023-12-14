import { CheckerStore } from "@components/CheckerStore";
import LoveChecklet from "@public/checklets/love.svg";
import PennyChecklet from "@public/checklets/penny.svg";
import SpacyChecklet from "@public/checklets/spacy.svg";
import Image from "next/image";
import React from "react";

const EditorHome: React.FC = () => {
    return (
        <div className="mx-auto container flex flex-col">
            <div className="text-center text-3xl mt-20 font-bold font-mackinac">
                What do you want to check?
            </div>
            <div className="mx-auto mt-2">
                Can&lsquo;t find a checker you like?{" "}
                <a
                    href="/create/checker"
                    className="mx-auto mt-4 border-b-2 border-blue-500 hover:text-blue-600"
                >
                    Create your own Checker
                </a>
            </div>
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
            <CheckerStore />
            {/* <TextButton
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
            </TextButton> */}
        </div>
    );
};

export default EditorHome;
