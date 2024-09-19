"use client";
import { useClientCtx } from "@/app/ClientCtx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const MenuHeader = () => {
  const pathname = usePathname();
  const { user, firebaseAuth } = useClientCtx();
  console.log("user", user);

  const handleSignOut = useCallback(() => {
    firebaseAuth
      .signOut()
      .then(async () => {
        // Then, we call /api/login endpoint exposed by the middleware. This endpoint updates our browser cookies with user credentials.
        // https://hackernoon.com/using-firebase-authentication-with-the-latest-nextjs-features
        await fetch("/api/logout");

        // refresh page so if we are on pages where auth matters, we refresh all the elements
        location.reload();
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
        toast.error("Error signing out");
      });
  }, [firebaseAuth]);

  // we need to use useEffect to get the window width so we don't get hydration errors (differing window width between server and client)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <div className="fixed left-0 top-0 z-10 w-full">
      <Link className="absolute left-4 mt-4 font-mackinac" href="/">
        Checklet
      </Link>
      {!isMobile && (
        <div className="absolute right-4 mt-4 flex flex-row space-x-8 font-bricolage">
          {pathname.startsWith("/editor") && (
            <Link href="/editor">Checkers</Link>
          )}
          {pathname.startsWith("/editor") && (
            <Link href="/dashboard">Dashboard</Link>
          )}
          {pathname !== "/signin" &&
            (!user ? (
              <Link href="/signin">Sign in</Link>
            ) : (
              <div className="cursor-pointer" onClick={handleSignOut}>
                Sign out
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
