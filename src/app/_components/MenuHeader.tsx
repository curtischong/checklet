"use client";
import { useClientCtx } from "@/app/ClientCtx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const MenuHeader = () => {
  const pathname = usePathname();
  const { user, firebaseAuth } = useClientCtx();

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
    <div className="fixed left-0 top-0 z-40 h-12 w-full bg-background">
      {/*  <div className="fixed left-0 top-0 z-40 h-40 w-full bg-gradient-to-b from-background to-transparent"> */}
      <Link
        className="absolute left-4 mt-[12px] font-mackinac"
        style={{
          fontSize: 18,
        }}
        href="/"
      >
        Checklet
      </Link>
      {!isMobile && (
        <div className="absolute right-4 mt-[13px] flex flex-row space-x-8">
          <Link
            href="/checkers"
            className={
              pathname.startsWith("/checkers")
                ? `underline underline-offset-4`
                : ""
            }
          >
            Checkers
          </Link>
          <Link
            href="/dashboard"
            className={
              pathname.startsWith("/dashboard")
                ? `underline underline-offset-4`
                : ""
            }
          >
            Dashboard
          </Link>
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
