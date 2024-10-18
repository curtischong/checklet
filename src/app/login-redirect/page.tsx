"use client";
import { LoginRedirectPage } from "@/app/login-redirect/LoginRedirectPage";
import { SignInPageBackground } from "@/app/signin/SignInPageBackground";

export default function Page() {
  return (
    <SignInPageBackground>
      <LoginRedirectPage />
    </SignInPageBackground>
  );
}
