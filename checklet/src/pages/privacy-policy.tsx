import { Footer } from "@/components/Footer";

const PrivacyPolicy: React.FC = () => {
    return (
        <>
            <div className="container mx-auto mt-20">
                <div className="flex flex-col justify-center">
                    <div className="w-[700px] mx-auto">
                        <h1 className="text-3xl font-bold font-mackinac text-center">
                            Privacy Policy
                        </h1>
                        <ul className="list-disc mt-8 space-y-8">
                            <li>
                                We won&apos;t collect your private data and sell
                                it to anybody
                            </li>
                            <li>
                                We will not store your documents. When you check
                                your document, we only send it to our servers
                                before sending it to OpenAI then back to you. If
                                you want complete privacy, you can pass in your
                                own API key (so the API calls to OpenAI are made
                                from your computer).
                            </li>
                            <li>
                                We will be able to see your checkers/checks. (So
                                we can moderate them).
                            </li>
                            <li>
                                If you pass in your private API key, the key is
                                stored in your browser&apos;s local storage. So
                                don&apos;t worry about that!
                            </li>
                            <li>
                                If you make a checker, other people can see the
                                checks / prompts (because they need the prompts
                                to run the check locally on their computer using
                                their API key)
                            </li>
                            {/* This isn't a privacy policy? Not sure where to put this*/}
                            <li>
                                You are the owner of the checkers/checks you
                                made. You typed them afterall!
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <Footer isAbsolute={true} />
        </>
    );
};

export default PrivacyPolicy;
