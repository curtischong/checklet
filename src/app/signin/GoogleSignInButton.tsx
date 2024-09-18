import Google from "@public/logos/google.svg";
import Image from "next/image";

// https://firebase.google.com/docs/auth/web/google-signin
const provider = new GoogleAuthProvider();
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useCallback } from "react";
import { app } from "@/server/firebase/firebase";

const auth = getAuth(app);
export const GoogleSignInButton = () => {
  const signInWithGoogle = useCallback(async () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        console.log(token);
        // // The signed-in user info.
        // const user = result.user;
        // // IdP data available using getAdditionalUserInfo(result)
        // // ...
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <button
      onClick={signInWithGoogle}
      className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition"
    >
      <span className="font-medium text-gray-700">Sign in with Google</span>
      <Image
        src={Google.src}
        alt={`Google logo`}
        className="w-6 h-6 ml-4"
        width={40}
        height={40}
      />
    </button>
  );
};
