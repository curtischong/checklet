"use client";
import { useClientCtx } from "@/app/ClientCtx";
import { api } from "@/trpc/react";
import Google from "@public/logos/google.svg";
import {
  getAdditionalUserInfo,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "react-toastify";

// https://firebase.google.com/docs/auth/web/google-signin
const provider = new GoogleAuthProvider();

export const GoogleSignInButton = () => {
  const router = useRouter();
  const { firebaseAuth } = useClientCtx();

  const onSignup = api.user.onSignup.useMutation({
    onSuccess: (res) => {
      console.log("success onsignup", res);
    },
    onError: (err) => {
      console.log("err onsignup", err);
    },
  });

  const signInWithGoogle = useCallback(() => {
    signInWithPopup(firebaseAuth, provider)
      .then(async (userCredential) => {
        const idToken = await userCredential.user.getIdToken();

        // Then, we call /api/login endpoint exposed by the middleware. This endpoint updates our browser cookies with user credentials.
        // https://hackernoon.com/using-firebase-authentication-with-the-latest-nextjs-features
        await fetch("/api/login", {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        // now that we've updated our credentials, we create a new user
        const additionalUserInfo = getAdditionalUserInfo(userCredential);
        if (!additionalUserInfo) {
          console.warn("additionalUserInfo is null");
        } else {
          if (additionalUserInfo.isNewUser) {
            onSignup.mutate();
          }
        }
        router.push("/checkers");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error as string);
      });
  }, [router, firebaseAuth, onSignup]);

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
