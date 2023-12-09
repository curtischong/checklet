import { CheckerStore } from "@components/CheckerStore";

const HomePage: React.FC = () => {
    // const router = useRouter();
    return (
        <div className="flex flex-row">
            <div className="container mx-auto text-center mt-20">
                <div className="ml-0">
                    <p className="text-4xl">I need a name lol</p>
                    <p>
                        This is Grammarly, but for anything. Writing jokes,
                        resumes, cold emails, etc.
                    </p>
                </div>
                <CheckerStore />

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
                <div>How it works</div>
                <div>1.</div>
                <div>Paste your resume/cold email/movie script</div>
                <div>2.</div>
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
