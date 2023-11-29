import { NormalButton, TextButton } from "@components/Button";
import { useClientContext } from "@utils/ClientContext";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";

// used to show you your checkers.
const Dashboard: React.FC = () => {
    const { user, firebaseAuth } = useClientContext();
    const router = useRouter();
    useEffect(() => {
        const isLoggedOut = user === null;
        if (isLoggedOut) {
            router.push("/login");
        }
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
            <div className="container mx-auto text-center mt-20">
                {user ? user.email : <></>}
                <p className="text-xl font-bold">Your Checkers</p>
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
