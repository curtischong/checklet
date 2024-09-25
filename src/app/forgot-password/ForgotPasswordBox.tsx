"use client";

import { LoadingButton } from "@/app/_components/ui/Button";
import { useClientCtx } from "@/app/ClientCtx";
import { sendPasswordResetEmail } from "firebase/auth";
import Link from "next/link";
import type { FormEvent } from "react";
import { useCallback, useState } from "react";

// TODO: when I have time, setup a reset password page (so users can reset their passwords in the same url - helps password managers)
// https://stackoverflow.com/questions/37932983/customize-reset-password-landing-page-in-firebase
export const ForgotPasswordBox = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { firebaseAuth } = useClientCtx();

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      setError("");
      setIsLoading(true);
      setIsSent(false);

      try {
        await sendPasswordResetEmail(firebaseAuth, email);
        setIsSent(true);
      } catch (e) {
        const message = (e as Error).message;
        console.error(message); // TODO: log error in logging app
        setError(message);
      }
      setIsLoading(false);
    },
    [email, firebaseAuth],
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
            {isSent && (
              <div className="text-center text-sm text-gray-900">
                Check your email for a password reset link!
              </div>
            )}
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
              className="focus:ring-primary-300 bg-confirm hover:bg-confirm2 h-10 w-full rounded-lg px-5 py-2.5 text-center text-sm text-white focus:outline-none"
            >
              Send Reset password email
            </LoadingButton>
            <p className="text-sm font-light text-gray-500">
              Remembered your password?{" "}
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
