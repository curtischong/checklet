import { Footer } from "@/components/Footer";

const TermsOfService: React.FC = () => {
    return (
        <>
            <div className="container mx-auto mt-20">
                <div className="flex flex-col justify-center">
                    <div className="w-[700px] mx-auto">
                        <h1 className="text-3xl font-bold font-mackinac text-center">
                            Terms of Service
                        </h1>
                        <ul className="list-disc mt-8  space-y-8">
                            <li>Please don&apos;t spam the servers.</li>
                            <li>
                                Please don&apos;t make checkers/checks that are
                                designed to waste API calls. Be friendly!
                            </li>
                            <li>
                                Please keep your checkers PG-13. They are public
                                afterall!
                            </li>
                            <li>Please don&apos;t harass other users.</li>
                        </ul>
                        <p className="mt-8">
                            If you break these terms of service I will ban you.
                            Just please don&apos;t be a jerk
                        </p>
                    </div>
                </div>
            </div>
            <Footer isAbsolute={true} />
        </>
    );
};

export default TermsOfService;
