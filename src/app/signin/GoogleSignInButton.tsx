"use client";
import { useClientCtx } from "@/app/ClientCtx";
import { useTrpcCtx } from "@/app/TrpcCtx";
import { handleErr } from "@/trpc/react";
import Google from "@public/logos/google.svg";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { toast } from "react-toastify";

// https://firebase.google.com/docs/auth/web/google-signin
const provider = new GoogleAuthProvider();

export const GoogleSignInButton = () => {
  const router = useRouter();
  const { firebaseAuth, user } = useClientCtx();
  const { trpcClient } = useTrpcCtx();

  useEffect(() => {
    // upon refresh (after the login), if the user is logged in, we need to trigger onSignup and redirect to /checkers
    if (user) {
      handleErr(trpcClient.user.onSignup.mutate(), () => {
        router.push("/checkers");
      });
    }
  }, []);

  const signInWithGoogle = useCallback(() => {
    signInWithPopup(firebaseAuth, provider)
      .then((userCredential) => {
        void (async () => {
          const idToken = await userCredential.user.getIdToken();

          // Then, we call /api/login endpoint exposed by the middleware. This endpoint updates our browser cookies with user credentials.
          // https://hackernoon.com/using-firebase-authentication-with-the-latest-nextjs-features
          await fetch("/api/login", {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          });

          // refresh page so we can create a new trpc websocket client with the new cookies
          location.reload(); // using router.refresh() doesn't trigger a full reload I think

          // now that we've updated our credentials, we create a new user
          // const additionalUserInfo = getAdditionalUserInfo(userCredential);
          // if (!additionalUserInfo) {
          //   console.warn("additionalUserInfo is null");
          //   router.push("/checkers");
          // } else {
          // if (additionalUserInfo.isNewUser) {
          // honestly, just always try to signup. cause when developing, I always clear the db
          // }
          // }
        })();
      })
      .catch((error) => {
        console.log(error);
        toast.error(error as string);
      });
  }, [router, firebaseAuth]);

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
