"use client";
import { useClientCtx } from "@/app/ClientCtx";
import { useTrpcCtx } from "@/app/TrpcCtx";
import { handleErr } from "@/trpc/react";
import { getRedirectResult } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

export const LoginRedirectPage = () => {
  const router = useRouter();
  const { firebaseAuth } = useClientCtx();
  const { trpcClient } = useTrpcCtx();

  useEffect(() => {
    getRedirectResult(firebaseAuth)
      .then(async (userCredential) => {
        if (!userCredential) {
          toast.error("Something happened. but you are NOT signed in");
          return;
        }
        const idToken = await userCredential.user.getIdToken();

        // Then, we call /api/login endpoint exposed by the middleware. This endpoint updates our browser cookies with user credentials.
        // https://hackernoon.com/using-firebase-authentication-with-the-latest-nextjs-features
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/login`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
        console.log("res", res);

        // now that we've updated our credentials, we create a new user
        // const additionalUserInfo = getAdditionalUserInfo(userCredential);
        // if (!additionalUserInfo) {
        //   console.warn("additionalUserInfo is null");
        // } else {
        // if (additionalUserInfo.isNewUser) {
        // honestly, just always try to signup. cause when developing, I always clear the db
        handleErr(trpcClient.user.onSignup.mutate(), () => {
          router.push("/checkers");
        });
        // }
        // }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error as string);
      });
  }, [router, firebaseAuth]);

  return <div>signing you in...</div>;
};
