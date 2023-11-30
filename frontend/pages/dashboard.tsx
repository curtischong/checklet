import { Api } from "@api/apis";
import { DeleteButton, NormalButton, TextButton } from "@components/Button";
import { CheckerBlueprint } from "@components/create-checker/CheckerCreator";
import { TrashIcon } from "@components/icons/TrashIcon";
import { useClientContext } from "@utils/ClientContext";
import { Popconfirm } from "antd";
import Link from "next/link";
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
                <div className="ml-4 w-80 mx-auto">
                    {checkers.map((checker, idx) => {
                        return (
                            <div
                                className="w-32 flex flex-row"
                                key={`checker-${idx}`}
                            >
                                <Popconfirm title={"Confirm Delete"}>
                                    <DeleteButton
                                        onClick={async () => {
                                            if (!user) {
                                                toast.error(
                                                    "You must be logged in to delete a checker",
                                                );
                                                return;
                                            }
                                            Api.deleteChecker(
                                                checker.id,
                                                await user.getIdToken(),
                                            ).then(() => {
                                                fetchCheckerBlueprints();
                                            });
                                        }}
                                    />
                                </Popconfirm>
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
