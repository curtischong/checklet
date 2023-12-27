import { Footer } from "@/components/Footer";
import { FlattenedPositiveExamplePreview } from "@/components/create-check/FlattenedPositiveExamplePreview";
import { CheckType } from "@/components/create-checker/CheckerTypes";

const PrivacyPolicy: React.FC = () => {
    return (
        <div className=" flex flex-col h-screen">
            <div
                className="container mx-auto mt-20 grow"
                style={{ flexBasis: 0 }}
            >
                <div className="flex flex-col justify-center">
                    <div className="max-w-[700px] mx-auto p-6">
                        <h1 className="text-3xl font-bold font-mackinac text-center">
                            Prompting Tips
                        </h1>
                        <ul className="list-disc mt-8 space-y-8 pl-4">
                            <li>
                                Just say the word &ldquo;highlight&rdquo; or
                                &ldquo;replace&rdquo; as the action to do
                                because those are the function names Checklet
                                asks GPT to call.
                            </li>
                            <li>
                                Also, breaking down your instructions into steps
                                helps
                            </li>
                            <li>
                                The models are horrible at counting words. We
                                gotta wait for GPT-5 for that :/
                            </li>
                            <li>
                                If you are using GPT4, the API calls are
                                happening in your browser. you can view the
                                console to see the calls (it can help with
                                debugging your prompts). There isn&apos;t a good
                                way to debug using gpt3.5 unless you clone the
                                repo
                            </li>
                        </ul>
                        <h2 className="text-2xl font-mackinac text-center font-bold mt-8">
                            Examples
                        </h2>
                        <p className="text-xl font-bricolage mt-4 font-bold">
                            Increase Hyperbole (To make Jokes funnier)
                        </p>
                        <p className="font-bold text-md mt-2">
                            Model Instructions
                        </p>
                        <p className="whitespace-pre">
                            {
                                "For each joke:\n1) Explain the joke to yourself to understand the hidden meaning of the joke.\n2) Change the joke so that the hidden meaning is more pronounced."
                            }
                        </p>
                        <p className="font-bold text-md mt-4 mb-2">
                            Positive Examples
                        </p>
                        <FlattenedPositiveExamplePreview
                            example={{
                                originalText:
                                    "When I was grounded, my parents took away my computer.",
                                editedText: [
                                    "My parents didn't like me. For bathtub toys they gave me a blender and a transistor radio",
                                ],
                            }}
                            checkType={CheckType.rephrase}
                            setPositiveExamples={() => {}}
                            positiveExamples={[]}
                            isDemo={true}
                        />
                        <div className="h-4"></div>
                        <FlattenedPositiveExamplePreview
                            example={{
                                originalText:
                                    "The NRA is now handing out guns to kindergarten students.",
                                editedText: [
                                    "NRA calls for teachers to keep loaded gun pointed at class for entire school day",
                                ],
                            }}
                            checkType={CheckType.rephrase}
                            setPositiveExamples={() => {}}
                            positiveExamples={[]}
                            isDemo={true}
                        />
                        <p className="text-xl font-bricolage mt-8 font-bold">
                            Comfort the Afflicted, Afflict the comfortable (To
                            keep your Joke classy)
                        </p>
                        <p className="font-bold text-md mt-2">
                            Model Instructions
                        </p>
                        <p className="whitespace-pre">
                            {
                                "For each joke:\n1) Identify if it is making fun of an afflicted group. Note: wealthy/successful people are not part of an afflicted group.\n2) If the joke is, then highlight it."
                            }
                        </p>
                        <p className="font-bold text-md mt-4 mb-2">
                            Positive Examples
                        </p>
                        <FlattenedPositiveExamplePreview
                            example={{
                                originalText: "You are as sloppy as a refugee.",
                                editedText: [],
                            }}
                            checkType={CheckType.highlight}
                            setPositiveExamples={() => {}}
                            positiveExamples={[]}
                            isDemo={true}
                        />
                        <div className="h-2"></div>
                        <FlattenedPositiveExamplePreview
                            example={{
                                originalText:
                                    "You're as greedy as a homeless person",
                                editedText: [],
                            }}
                            checkType={CheckType.highlight}
                            setPositiveExamples={() => {}}
                            positiveExamples={[]}
                            isDemo={true}
                        />
                    </div>
                </div>
            </div>
            <Footer isAbsolute={false} />
        </div>
    );
};

export default PrivacyPolicy;
