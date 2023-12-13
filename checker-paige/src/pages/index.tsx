import { NormalButton } from "@/components/Button";
import ThinLine from "@/components/ThinLine";
import DerpCheckie from "@public/checkies/derp.svg";
import FlyDownCheckie from "@public/checkies/fly-down.svg";
import JumpLeftCheckie from "@public/checkies/jump-left.svg";
import LookRightCheckie from "@public/checkies/look-right.svg";
import LoveCheckie from "@public/checkies/love.svg";
import NormalCheckie from "@public/checkies/normal.svg";
import Image from "next/image";
import { useRouter } from "next/router";

const HomePage: React.FC = () => {
    const router = useRouter();
    return (
        <div className="flex flex-row ">
            <div className="container mx-auto text-center">
                <div className="ml-0 h-screen flex flex-col justify-center">
                    <Image
                        alt="FlyDownCheckie"
                        src={FlyDownCheckie.src}
                        width={200}
                        height={200}
                        className="h-[8rem] top-32 left-[20%] absolute"
                    />
                    <Image
                        alt="NormalCheckie"
                        src={NormalCheckie.src}
                        width={200}
                        height={200}
                        className="h-[5rem] bottom-[10rem] right-[30%] absolute"
                    />
                    <p className="text-4xl font-mackinac">Checkie.page</p>
                    <p>
                        Figuring out what to say is always harder than knowing
                        how to say it right. Use expert-written checkers to
                        polish jokes, edit resumes, or write cold emails.
                    </p>
                </div>
                <div className="text-2xl mt-8 font-mackinac">How it works</div>
                <ThinLine />
                <div className="flex flex-row">
                    <div className="text-2xl">
                        1. Select a Checker for your type of writing
                    </div>
                    {/* <div>
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
                    </div> */}
                </div>
                <Image
                    alt="DerpCheckie"
                    src={DerpCheckie.src}
                    width={200}
                    height={200}
                    className="h-[5rem] top-[100rem] right-[30%] absolute"
                />
                <Image
                    alt="LoveCheckie"
                    src={LoveCheckie.src}
                    width={200}
                    height={200}
                    className="h-[6rem] top-[80rem] right-[30%] absolute"
                />
                <Image
                    alt="LookRightCheckie"
                    src={LookRightCheckie.src}
                    width={200}
                    height={200}
                    className="h-[5rem] top-[100rem] left-[20%] absolute"
                />
                <Image
                    alt="JumpLeftCheckie"
                    src={JumpLeftCheckie.src}
                    width={200}
                    height={200}
                    className="h-[6rem] top-[80rem] left-[30%] absolute"
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
        </div>
    );
};

export default HomePage;
