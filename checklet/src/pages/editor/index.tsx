import { CheckerStore } from "@components/CheckerStore";
import { useClientContext } from "@utils/ClientContext";
import { useRouter } from "next/router";
import React from "react";

const EditorHome: React.FC = () => {
    const router = useRouter();
    const { user } = useClientContext();
    return (
        <div className="mx-auto container">
            <div className="text-center text-3xl mt-12 font-bold">
                What do you want to check?
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
