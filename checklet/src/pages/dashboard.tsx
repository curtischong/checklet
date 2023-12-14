import { Api } from "@api/apis";
import { NormalButton } from "@components/Button";
import { CheckerBlueprint } from "@components/create-checker/CheckerTypes";
import { DashboardChecker } from "@components/create-checker/DashboardChecker";
import { useClientContext } from "@utils/ClientContext";
import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";
import { toast } from "react-toastify";

// used to show you your checkers.
const Dashboard: React.FC = () => {
    const { user } = useClientContext();
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
            const checkerBlueprints = await Api.userCheckerBlueprints(user);
            if (!checkerBlueprints) {
                return;
            }
            setCheckers(checkerBlueprints);
        })();
    }, [user]);

    useEffect(() => {
        fetchCheckerBlueprints();
    }, [fetchCheckerBlueprints]);

    const createChecker = useCallback(async () => {
        if (!user) {
            toast.error("You must be logged in to create a checker");
            return;
        }

        // if no checkerId is provided, then we are creating a new checker
        const checkerId = await Api.createChecker(user);
        if (!checkerId) {
            toast.error("Failed to create checker");
            return;
        }

        router.push(`/create/checker/${checkerId}`);
    }, [user]);

    return (
        <div className="flex">
            <div className="container mx-auto mt-20">
                {/* {user ? user.email : <></>} */}
                <p className="text-2xl font-bold">Your Checkers</p>
                <div className="ml-0 w-[450px] mx-auto mt-4">
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
                <NormalButton onClick={createChecker}>
                    Create Checker
                </NormalButton>
            </div>
        </div>
    );
};

export default Dashboard;
