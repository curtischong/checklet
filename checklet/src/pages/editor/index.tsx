import { CheckerStore } from "@components/CheckerStore";
import React from "react";

const EditorHome: React.FC = () => {
    return (
        <div className="mx-auto container flex flex-col">
            <div className="text-center text-3xl mt-12 font-bold font-mackinac">
                What do you want to check?
            </div>
            <div className="mx-auto mt-4">
                Can&lsquo;t find a checker you like?{" "}
                <a
                    href="/create/checker"
                    className="mx-auto mt-4 border-b-2 border-blue-500 hover:text-blue-600"
                >
                    Create your own Checker
                </a>
            </div>
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
