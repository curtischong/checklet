import { LinkButton } from "@/components/Button";
import { StoreFront } from "@/components/CheckerStore";
import { Footer } from "@/components/Footer";
import ThinLine from "@/components/ThinLine";
import { CheckPreview } from "@/components/create-check/CheckPreview";
import { CheckType } from "@/components/create-checker/CheckerTypes";
import { CursorIcon } from "@/components/icons/CursorIcon";
import { DownArrowWithTailIcon } from "@/components/icons/DownArrowWithTailIcon";
import { createShortId } from "@/utils/strings";
import DerpChecklet from "@public/checklets/derp.svg";
import DockyChecklet from "@public/checklets/docky.svg";
import LoveChecklet from "@public/checklets/love.svg";
import MushyChecklet from "@public/checklets/mushy.svg";
import PennyChecklet from "@public/checklets/penny.svg";
import SpacyChecklet from "@public/checklets/spacy.svg";
import Image from "next/image";

const HomePage: React.FC = () => {
    return (
        <div>
            <div className="container mx-auto text-center px-6">
                <div className="ml-0 h-[100vh] flex flex-col justify-center">
                    <Image
                        alt="SpacyChecklet"
                        src={SpacyChecklet.src}
                        width={200}
                        height={200}
                        className="h-[8rem] top-[10%] md:top-[20%] left-[5%] md:left-[20%] absolute"
                    />
                    <Image
                        alt="LoveChecklet"
                        src={LoveChecklet.src}
                        width={200}
                        height={200}
                        className="h-[6rem] bottom-[25%] right-[0%] md:right-[20%] absolute"
                    />
                    <Image
                        alt="DockyChecklet"
                        src={DockyChecklet.src}
                        width={200}
                        height={200}
                        className="h-[6rem] bottom-[15%] left-[5%] md:left-[30%] absolute"
                    />
                    <Image
                        alt="DerpChecklet"
                        src={DerpChecklet.src}
                        width={200}
                        height={200}
                        className="h-[5rem] top-[5%] right-[5%] md:right-[30%] absolute"
                    />
                    <p className="text-5xl font-mackinac">Checklet.page</p>
                    <p className="mt-4">
                        Expert-written checkers to polish jokes, edit resumes,
                        revise emails... and check anything!
                    </p>
                    <div className="w-[200px] mt-4 mx-auto">
                        <LinkButton url={"/editor"}>Try it out</LinkButton>
                    </div>
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
                <div className=" text-left max-w-[70%] justify-center flex flex-col mx-auto">
                    <div className="flex flex-row justify-center space-x-8 mt-10 relative">
                        <div className="text-lg flex-1">
                            1. Select a Checker for your type of writing
                        </div>
                        <div className="flex-1">
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
                                isDemo={true}
                            />
                            <CursorIcon className="w-[40px] h-[40px] right-32 bottom-[-20px] absolute" />
                        </div>
                        <Image
                            alt="MushyChecklet"
                            src={MushyChecklet.src}
                            width={200}
                            height={200}
                            className="h-[5rem] top-[5rem] left-[10%] absolute"
                        />
                    </div>

                    <div className="flex flex-row justify-center space-x-8 mt-32 relative">
                        <div className="text-lg flex-1">
                            2. Paste your writing into the editor
                        </div>
                        <div className="relative  w-[300px] flex-1">
                            <div className="text-3xl font-mackinac text-gray-400">
                                Rizzume
                            </div>
                            <div className="text-md text-gray-400">
                                Rizz up your resume to dazzle...
                            </div>
                            <hr className="bg-black w-full h-[2px]" />
                            <div>Grammarly • January 2021 - Present</div>
                            <div>
                                • Expedited DynamoDB queries from 68 ms to 41 ms
                                by optimizing the schema for reads
                            </div>
                            <div>...</div>
                        </div>
                        <Image
                            alt="PennyChecklet"
                            src={PennyChecklet.src}
                            width={200}
                            height={200}
                            className="h-[7rem] top-[1rem] right-[-50%] md:right-[-30%] absolute"
                        />
                    </div>
                    <div className="flex flex-row justify-center space-x-8 mt-8 ">
                        <div className="text-lg flex-1">
                            3. Receive instant feedback
                        </div>

                        <div className="flex-1">
                            <div className="max-w-[350px]">
                                <CheckPreview
                                    blueprint={{
                                        objInfo: {
                                            id: "",
                                            name: "",
                                            desc: "",
                                            creatorId: "",
                                        },
                                        instruction: "",
                                        category: "",
                                        checkType: CheckType.rephrase,
                                        positiveExamples: [],
                                    }}
                                    originalText=""
                                    editedText=""
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <LinkButton url={"/editor"}>Try it out</LinkButton>
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
            <Footer isAbsolute={false} />
        </div>
    );
};

export default HomePage;
