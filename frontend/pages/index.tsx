import { NormalButton } from "@components/Button";
import { useRouter } from "next/router";

const PrivacyPolicy: React.FC = () => {
    const router = useRouter();
    return (
        <div className="flex flex-row">
            <div className="container mx-auto text-center mt-20">
                <p>Learn from Experts</p>

                <NormalButton
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
                <div>How it works</div>
                <div>1.</div>
                <div>Paste your resume/cold email/movie script</div>
                <div>2.</div>
                <div>
                    Get tailored suggestions written by experts in the field
                </div>
                <div>3.</div>
                <div>Edit your document!</div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
