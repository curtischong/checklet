import { LinkButton } from "@/components/Button";
import { StoreFront } from "@/components/CheckerStore";
import { Footer } from "@/components/Footer";
import ThinLine from "@/components/ThinLine";
import { CheckPreview } from "@/components/create-check/CheckPreview";
import { rizzumeDesc } from "@/components/create-check/DefaultTextForCheckType";
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
                        width={100}
                        height={100}
                        className="top-[10%] md:top-[20%] left-[5%] md:left-[20%] absolute"
                    />
                    <Image
                        alt="LoveChecklet"
                        src={LoveChecklet.src}
                        width={100}
                        height={200}
                        className="bottom-[5%] md:bottom-[25%] right-[2%] md:right-[20%] absolute"
                    />
                    <Image
                        alt="DockyChecklet"
                        src={DockyChecklet.src}
                        width={100}
                        height={200}
                        className="bottom-[10%] left-[2%] md:left-[30%] absolute"
                    />
                    <Image
                        alt="DerpChecklet"
                        src={DerpChecklet.src}
                        width={100}
                        height={200}
                        className="top-[5%] right-[5%] md:right-[30%] absolute"
                    />
                    <p className="text-5xl font-mackinac">Checklet</p>
                    <p className="mt-4 z-10">
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
                <div className=" text-left md:max-w-[70%] justify-center flex flex-col mx-auto">
                    <div className="flex flex-col md:flex-row justify-center gap-8 mt-10 relative">
                        <div className="text-lg flex-1">
                            1. Select a Checker for your type of writing
                        </div>
                        <div className="flex-1">
                            <StoreFront
                                storefront={{
                                    objInfo: {
                                        name: "Rizzume",
                                        desc: rizzumeDesc,
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
                            width={100}
                            height={200}
                            className="md:top-[4rem] right-0 top-[32px] md:left-[10%] absolute"
                        />
                    </div>

                    <div className="flex flex-col md:flex-row justify-center gap-8 mt-10 relative">
                        <div className="text-lg flex-1">
                            2. Paste your writing into the editor
                        </div>
                        <div className="flex-1 ">
                            <div className="relative  max-w-[300px]">
                                <div className="text-3xl font-mackinac text-gray-400">
                                    Rizzume
                                </div>
                                <div className="text-md text-gray-400">
                                    Rizz up your resume to dazzle...
                                </div>
                                <hr className="bg-black w-full h-[2px]" />
                                <div>Grammarly • January 2021 - Present</div>
                                <div>
                                    • Expedited DynamoDB queries from 68 ms to
                                    41 ms by optimizing the schema for reads
                                </div>
                                <div>...</div>
                            </div>
                        </div>
                    </div>
                    <div className="relative h-32 justify-center">
                        <Image
                            alt="PennyChecklet"
                            src={PennyChecklet.src}
                            width={100}
                            height={100}
                            className="top-[0px] md:top-[1rem] right-[30%] absolute"
                        />
                    </div>
                    <div className="flex flex-col md:flex-row justify-center gap-8">
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
            </div>
            <Footer isAbsolute={false} />
        </div>
    );
};

export default HomePage;
