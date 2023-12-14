import { useClientContext } from "@/utils/ClientContext";
import { useRouter } from "next/router";

export const MenuHeader = () => {
    const { user } = useClientContext();
    const router = useRouter();
    return (
        <div className="absolute top-0 left-0 w-full">
            <a className="absolute left-4 mt-4 font-mackinac" href="/">
                Checklet.page
            </a>
            <div className="absolute mt-4 right-20">
                {!router.pathname.startsWith("/editor") && (
                    <a href="/editor">Checkers</a>
                )}
            </div>
            {router.pathname !== "/login" &&
                (user === null ? (
                    <div className="absolute mt-4 right-4">
                        <a href="/login">login</a>
                    </div>
                ) : (
                    <div className="absolute mt-4 right-4">
                        <a href="/logout">logout</a>
                    </div>
                ))}
        </div>
    );
};
