import { TextButton } from "@components/Button";
import { CheckerStore } from "@components/CheckerStore";
import { useClientContext } from "@utils/ClientContext";
import { useRouter } from "next/router";
import React from "react";

const EditorHome: React.FC = () => {
    const router = useRouter();
    const { user } = useClientContext();
    return (
        <div>
            <div>What do you want to check?</div>
            <CheckerStore />
            <TextButton
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
            </TextButton>
        </div>
    );
};

export default EditorHome;
