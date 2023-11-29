import { Api } from "@api/apis";
import { NormalButton, TextButton } from "@components/Button";
import { CheckerBlueprint } from "@components/create-checker/CheckerCreator";
import { useClientContext } from "@utils/ClientContext";
import { useRouter } from "next/router";
import React from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";

// used to show you your checkers.
const Dashboard: React.FC = () => {
    const { user, firebaseAuth } = useClientContext();
    const router = useRouter();
    const [checkers, setCheckers] = React.useState<CheckerBlueprint[]>([]);
    useEffect(() => {
        const isLoggedOut = user === null;
        if (isLoggedOut) {
            router.push("/login");
        }
    }, [user]);

    useEffect(() => {
        (async () => {
            const checkerBlueprints = await Api.fetchUserCheckerBlueprints();
            setCheckers(checkerBlueprints);
        })();
    }, []);

    return (
        <div className="flex">
            <TextButton
                className="fixed right-5 top-3"
                onClick={() => {
                    firebaseAuth.signOut().then(
                        function () {
                            // Sign-out successful.
                            router.push("/");
                        },
                        function (error) {
                            toast.error(error.message);
                        },
                    );
                }}
            >
                logout
            </TextButton>
            <div className="container mx-auto text-center mt-20">
                {user ? user.email : <></>}
                <p className="text-xl font-bold">Your Checkers</p>
                {checkers.map((checker, idx) => {
                    return (
                        <div
                            className="flex justify-center"
                            key={`checker-${idx}`}
                        >
                            <NormalButton
                                onClick={() => {
                                    router.push(
                                        `/create-checker/${checker.id}`, // TODO: add a url param so if it exists, we call redis and pass the blueprint
                                    );
                                }}
                            >
                                {checker.name}
                            </NormalButton>
                        </div>
                    );
                })}
                <NormalButton
                    onClick={() => {
                        router.push("/create-checker");
                    }}
                >
                    Create Checker
                </NormalButton>
            </div>
        </div>
    );
};

export default Dashboard;
