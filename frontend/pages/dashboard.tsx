import { Api } from "@api/apis";
import { NormalButton, TextButton } from "@components/Button";
import { CheckerBlueprint } from "@components/create-checker/CheckerTypes";
import { DashboardChecker } from "@components/create-checker/DashboardChecker";
import { useClientContext } from "@utils/ClientContext";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
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

    const fetchCheckerBlueprints = useCallback(() => {
        (async () => {
            if (user === null) {
                return;
            }
            const checkerBlueprints = await Api.userCheckerBlueprints(
                await user.getIdToken(),
            );
            setCheckers(checkerBlueprints);
        })();
    }, [user]);

    useEffect(() => {
        fetchCheckerBlueprints();
    }, [fetchCheckerBlueprints]);

    return (
        <div className="flex">
            <TextButton
                className="fixed right-5 top-3"
                onClick={() => {
                    firebaseAuth.signOut().then(
                        function () {
                            // Sign-out successful.
                            router.push("/editor");
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
                    router.push("/editor");
                }}
            >
                Editor
            </TextButton>
            <div className="container mx-auto mt-20">
                {user ? user.email : <></>}
                <p className="text-xl font-bold">Your Checkers</p>
                <div className="ml-4 w-80 mx-auto mt-4">
                    {checkers.map((checkerBlueprint, idx) => {
                        return (
                            <div key={`checker-${idx}`}>
                                <DashboardChecker
                                    blueprint={checkerBlueprint}
                                    fetchCheckerBlueprints={
                                        fetchCheckerBlueprints
                                    }
                                />
                            </div>
                        );
                    })}
                </div>
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
