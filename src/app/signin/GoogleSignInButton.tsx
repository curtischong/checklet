"use client";
import Google from "@public/logos/google.svg";
import Image from "next/image";

// https://firebase.google.com/docs/auth/web/google-signin
const provider = new GoogleAuthProvider();
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useClientCtx } from "@/app/ClientCtx";

export const GoogleSignInButton = () => {
  const router = useRouter();
  const { firebaseAuth } = useClientCtx();

  const signInWithGoogle = useCallback(async () => {
    signInWithPopup(firebaseAuth, provider)
      .then((_result) => {
        router.push("/checkers/edit");
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
