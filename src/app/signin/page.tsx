import SignInPage from "@/app/signin/SignInPage";
import { getProviders } from "next-auth/react";

export default async function Page() {
  const providers = await getProviders();
  return <SignInPage providers={providers} />;
}
