import { NormalButton } from "@/components/Button";
import { StoreFront } from "@/components/CheckerStore";
import ThinLine from "@/components/ThinLine";
import { DownArrowWithTailIcon } from "@/components/icons/DownArrowWithTailIcon";
import { createShortId } from "@/utils/strings";
import DerpChecklet from "@public/checklets/derp.svg";
import DockyChecklet from "@public/checklets/docky.svg";
import LoveChecklet from "@public/checklets/love.svg";
import MushyChecklet from "@public/checklets/mushy.svg";
import PennyChecklet from "@public/checklets/penny.svg";
import SpacyChecklet from "@public/checklets/spacy.svg";
import Image from "next/image";
import { useRouter } from "next/router";

const HomePage: React.FC = () => {
    const router = useRouter();
    return (
        <div className="container mx-auto text-center px-3">
            <div className="ml-0 h-[100vh] flex flex-col justify-center">
                <Image
                    alt="SpacyChecklet"
                    src={SpacyChecklet.src}
                    width={200}
                    height={200}
                    className="h-[8rem] top-32 left-[20%] absolute"
                />
                <Image
                    alt="LoveChecklet"
                    src={LoveChecklet.src}
                    width={200}
                    height={200}
                    className="h-[6rem] bottom-[15rem] right-[5%] md:right-[20%] absolute"
                />
                <Image
                    alt="DockyChecklet"
                    src={DockyChecklet.src}
                    width={200}
                    height={200}
                    className="h-[6rem] bottom-[10rem] left-[5%] md:left-[30%] absolute"
                />
                <p className="text-4xl font-mackinac">Checklet.page</p>
                <p className="mt-4">
                    Expert-written checkers to polish jokes, edit resumes,
                    revise emails... check anything!
                </p>
                <div
                    className="border-[2px] border-gray-500 hover:border-gray-600 rounded-[100px] w-[40px] h-[40px] absolute bottom-8 left-[calc(50%-20px)] cursor-pointer"
                    onClick={() =>
                        window.scrollBy({
                            left: 0,
                            top: window.innerHeight,
                            behavior: "smooth",
                        })
                    }
                >
                    <DownArrowWithTailIcon className="mx-auto mt-[5px]" />
                </div>
            </div>
            <div className="text-3xl mt-32 font-mackinac">How it works</div>
            <ThinLine />
            <div className="flex flex-row">
                <div className="text-2xl">
                    1. Select a Checker for your type of writing
                </div>
                <div>
                    <StoreFront
                        storefront={{
                            objInfo: {
                                name: "Rizzume",
                                desc: "Rizz up your resume to dazzle any employer. It will make points sharp and salient. All to make you sound impressive.",
                                id: createShortId(),
                                creatorId: "fakeuser",
                            },
                            placeholder: "paste yourresume",
                        }}
                    />
                </div>
            </div>
            <Image
                alt="PennyChecklet"
                src={PennyChecklet.src}
                width={200}
                height={200}
                className="h-[7rem] top-[60rem] right-[20%] absolute"
            />
            <Image
                alt="DerpChecklet"
                src={DerpChecklet.src}
                width={200}
                height={200}
                className="h-[5rem] top-[100rem] right-[30%] absolute"
            />
            <Image
                alt="MushyChecklet"
                src={MushyChecklet.src}
                width={200}
                height={200}
                className="h-[5rem] top-[70rem] right-[30%] absolute"
            />
            <div className="flex flex-row">
                <div className="text-2xl">
                    2. Paste your writing into the editor
                </div>
            </div>
            <div className="flex flex-row">
                <div className="text-2xl">3. Receive instant feedback</div>
            </div>
            <NormalButton
                onClick={() => {
                    router.push("/editor");
                }}
            >
                Try it out
            </NormalButton>
            {/* <CheckerStore /> */}

            {/* <NormalButton
                    onClick={() => {
                        router.push("/editor");
                    }}
                >
                    Try fixing my work!
                </NormalButton>
                <div>
                    We ask experts for help all the time. Because they help out
                    with our specific need
                </div>
                <div>Online courses don't work. Why? </div>
                <div>
                    Get tailored suggestions written by experts in the field
                </div>
                <div>3.</div>
                <div>Edit your document!</div> 
                <p>Special thanks to Joseph Anderson and James Portnow for being fantastic writers and inspiring me to make this/write in general</p>
                */}
        </div>
    );
};

export default HomePage;
