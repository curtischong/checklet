import { Api } from "@api/apis";
import { NormalButton, TextButton } from "@components/Button";
import { CheckerBlueprint } from "@components/create-checker/CheckerCreator";
import { useClientContext } from "@utils/ClientContext";
import Link from "next/link";
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
            if (user === null) {
                return;
            }
            const checkerBlueprints = await Api.fetchUserCheckerBlueprints(
                await user.getIdToken(),
            );
            setCheckers(checkerBlueprints);
        })();
    }, [user]);

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
            <TextButton
                className="fixed right-20 top-3"
                onClick={() => {
                    router.push("/");
                }}
            >
                Editor
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
                            <Link
                                href={{
                                    pathname: "/create-checker",
                                    query: {
                                        checkerId: checker.id,
                                    },
                                }}
                            >
                                {checker.name}
                            </Link>
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
