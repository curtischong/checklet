"use client";
import { useClientCtx } from "@/app/ClientCtx";
import { useTrpcCtx } from "@/app/TrpcCtx";
import Google from "@public/logos/google.svg";
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const GoogleSignInButton = () => {
  const { firebaseAuth, firebaseUser } = useClientCtx();
  const { trpcClient } = useTrpcCtx();
  const router = useRouter();

  const signInWithGoogle = () => {
    // https://firebase.google.com/docs/auth/web/google-signin
    const provider = new GoogleAuthProvider();
    void signInWithRedirect(firebaseAuth, provider);
  };

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
