"use client";
import ThinLine from "@/app/_components/ThinLine";
import { LoadingButton } from "@/app/_components/ui/Button";
import { GoogleSignInButton } from "@/app/signin/GoogleSignInButton";
import { app } from "@/server/firebase/firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import type { FormEvent } from "react";

export default function SignInBox() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const makeErrMsgReadable = useCallback((message: string) => {
    if (
      message === "Firebase: Error (auth/invalid-credential)." ||
      message === "Firebase: Error (auth/invalid-email)."
    ) {
      return "Invalid email or password (did you register?)";
    }
    return message;
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      setError("");
      setIsLoading(true);

      try {
        const credential = await signInWithEmailAndPassword(
          getAuth(app),
          email,
          password,
        );
        const idToken = await credential.user.getIdToken();

        await fetch("/api/login", {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        setIsLoading(false);
        router.push("/checkers/edit");
      } catch (e) {
        const message = (e as Error).message;
        console.error(message); // TODO: log error
        setError(makeErrMsgReadable(message));
        setIsLoading(false);
      }
    },
    [email, makeErrMsgReadable, password, router],
  );

  return (
    <div className="flex flex-col items-center justify-center font-nunito">
      <div className="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0 dark:border dark:border-gray-700 dark:bg-gray-800">
        <GoogleSignInButton />
        <ThinLine className="mt-8" color={"gray-800"} />
        <div className="space-y-4 p-8 pt-6 md:space-y-6">
          <form
            // onSubmit={handleSubmit}
            className="space-y-4 md:space-y-6"
            action="#"
          >
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm text-gray-900 dark:text-white"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="your email"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm text-gray-900 dark:text-white"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                placeholder="••••••••"
                className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                required
              />
            </div>
            {error && (
              <div
                className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <LoadingButton
              onClick={handleSubmit}
              loading={isLoading}
              type="submit"
              className="focus:ring-primary-300 dark:focus:ring-primary-800 h-10 w-full rounded-lg px-5 py-2.5 text-center text-sm text-white focus:outline-none"
            >
              Sign In
            </LoadingButton>
            <div className="flex flex-col items-center space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Forgot your password?{" "}
                <Link
                  href="/forgot-password"
                  className="text-primary hover:underline"
                >
                  Reset your password here
                </Link>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  Register here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
