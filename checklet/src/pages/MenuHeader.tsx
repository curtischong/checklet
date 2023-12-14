import { useClientContext } from "@/utils/ClientContext";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const MenuHeader = () => {
    const { user, firebaseAuth } = useClientContext();
    const router = useRouter();

    const logout = useCallback(() => {
        firebaseAuth
            .signOut()
            .catch((error) => {
                console.error("Error signing out: ", error);
                toast.error("Error signing out");
            })
            .then(() => {
                // refresh page so if we are on pages where auth matters, we refresh all the elements
                router.reload();
            });
    }, [firebaseAuth, router]);

    // we need to use useEffect to get the window width so we don't get hydration errors (differing window width between server and client)
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full">
            <a className="absolute left-4 mt-4 font-mackinac" href="/">
                Checklet.page
            </a>
            {!isMobile && (
                <div className="absolute mt-4 flex flex-row right-4 space-x-8">
                    {!router.pathname.startsWith("/editor") && (
                        <a href="/editor">Checkers</a>
                    )}
                    {router.pathname.startsWith("/editor") && (
                        <a href="/dashboard">Dashboard</a>
                    )}
                    {router.pathname !== "/login" &&
                        (user === null ? (
                            <a href="/login">Login</a>
                        ) : (
                            <div className="cursor-pointer" onClick={logout}>
                                Logout
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};
