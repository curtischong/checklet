"use client";
import Google from "@public/logos/google.svg";
import Image from "next/image";

// https://firebase.google.com/docs/auth/web/google-signin
const provider = new GoogleAuthProvider();
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useCallback } from "react";
import { app } from "@/server/firebase/firebase";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const auth = getAuth(app);
export const GoogleSignInButton = () => {
  const router = useRouter();

  const signInWithGoogle = useCallback(async () => {
    signInWithPopup(auth, provider)
      .then((_result) => {
        router.push("/checkers");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error as string);
      });
  }, [router]);

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
