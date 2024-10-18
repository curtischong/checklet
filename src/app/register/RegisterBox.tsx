"use client";

import { LoadingButton } from "@/app/_components/ui/Button";
import { useClientCtx } from "@/app/ClientCtx";
import { useTrpcCtx } from "@/app/TrpcCtx";
import { handleErr } from "@/trpc/react";
import {
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
} from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useCallback, useState } from "react";

export const RegisterBox = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { firebaseAuth } = useClientCtx();
  const { trpcClient } = useTrpcCtx();

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      setError("");
      setIsLoading(true);

      if (password !== confirmation) {
        setError("Passwords don't match");
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(
          firebaseAuth,
          email,
          password,
        );

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
          // if (additionalUserInfo.isNewUser) {
          handleErr(trpcClient.user.onSignup.mutate());
          // }
        }

        router.push("/checkers");
      } catch (e) {
        const message = (e as Error).message;
        console.error(message); // TODO: log error in logging app
        setError(message);
      }
      setIsLoading(false);
    },
    [confirmation, email, password, router, firebaseAuth],
  );

  return (
    <main className="flex flex-col items-center justify-center p-8">
      <div className="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0">
        <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
          <form
            // onSubmit={handleSubmit}
            className="space-y-4 md:space-y-6"
            action="#"
          >
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Your email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm"
                placeholder="Your email"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-900"
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
                className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Confirm password
              </label>
              <input
                type="password"
                name="confirm-password"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                id="confirm-password"
                placeholder="••••••••"
                className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm"
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
              className="focus:ring-primary-300 h-10 w-full rounded-lg px-5 py-2.5 text-center text-sm text-white focus:outline-none"
            >
              Create an account
            </LoadingButton>
            <p className="text-sm font-light text-gray-500">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-medium text-primary hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
};
