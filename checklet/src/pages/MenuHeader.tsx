import { useClientContext } from "@/utils/ClientContext";
import { useRouter } from "next/router";

export const MenuHeader = () => {
    const { user, logout } = useClientContext();
    const router = useRouter();
    return (
        <div className="fixed top-0 left-0 w-full">
            <a className="absolute left-4 mt-4 font-mackinac" href="/">
                Checklet.page
            </a>
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
        </div>
    );
};
