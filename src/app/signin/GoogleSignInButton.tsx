"use client";
import { useClientCtx } from "@/app/ClientCtx";
import { useTrpcCtx } from "@/app/TrpcCtx";
import { handleErr } from "@/trpc/react";
import Google from "@public/logos/google.svg";
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { toast } from "react-toastify";

// https://firebase.google.com/docs/auth/web/google-signin
const provider = new GoogleAuthProvider();

export const GoogleSignInButton = () => {
  const { firebaseAuth, firebaseUser } = useClientCtx();
  const { trpcClient } = useTrpcCtx();
  const router = useRouter();

  // handle when the user returns
  useEffect(() => {
    void (async () => {
      try {
        if (!firebaseUser) {
          console.warn(
            "firebaseUser is null. the user is not logged in. this is only an error if the user came back from loginWithRedirect",
          );
          return;
        }
        // the user is logged in. so make the additional calls
        const idToken = await firebaseUser.getIdToken();

        // Then, we call /api/login endpoint exposed by the middleware.
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/login`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
        console.log("res", res);

        // Create a new user or handle post-login actions
        // const additionalUserInfo = getAdditionalUserInfo(firebaseUser);
        // if (!additionalUserInfo) {
        //   console.warn("additionalUserInfo is null");
        // } else {
        // Always try to signup during development
        handleErr(trpcClient.user.onSignup.mutate(), () => {
          void router.push("/checkers");
        });
        // }
      } catch (error) {
        console.error("Error during redirect result:", error);
        toast.error("Something went wrong during login.");
      }
    })();
  }, [firebaseUser, router]);

  const signInWithGoogle = useCallback(() => {
    void signInWithRedirect(firebaseAuth, provider);
  }, [firebaseAuth]);

  return (
    <button
      onClick={signInWithGoogle}
      className="mx-auto mt-8 flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm transition hover:bg-gray-50"
    >
      <Image
        src={Google as string}
        alt={`Google logo`}
        className="mr-4 h-6 w-6"
        width={40}
        height={40}
      />
      <span className="font-medium text-gray-700">Sign in with Google</span>
    </button>
  );
};
