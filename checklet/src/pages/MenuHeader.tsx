import { useClientContext } from "@/utils/ClientContext";
import { useRouter } from "next/router";

export const MenuHeader = () => {
    const { user, logout } = useClientContext();
    const router = useRouter();
    return (
        <div className="absolute top-0 left-0 w-full">
            <a className="absolute left-4 mt-4 font-mackinac" href="/">
                Checklet.page
            </a>
            <div className="absolute mt-4 flex flex-row right-4 space-x-8">
                {!router.pathname.startsWith("/editor") && (
                    // <div className="absolute mt-4 right-24">
                    <a href="/editor">Checkers</a>
                    // </div>
                )}
                {router.pathname.startsWith("/editor") && (
                    // <div className="absolute mt-4 right-24">
                    <a href="/dashboard">Dashboard</a>
                    // </div>
                )}
                {router.pathname !== "/login" &&
                    (user === null ? (
                        // <div className="absolute mt-4 right-4">
                        <a href="/login">Login</a> // </div>
                    ) : (
                        <div className="cursor-pointer" onClick={logout}>
                            Logout
                        </div>
                    ))}
            </div>
        </div>
    );
};
