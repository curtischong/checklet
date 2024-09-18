import SignInPage from "@/app/signin/SignInPage";
import { getUserCtx } from "@/server/firebase/user_ctx";

export default async function Page() {
  const userCtx = await getUserCtx();
  // TODO: what to do if the user is already signed in?
  // this should be handled in the middleware. redirect to /checkers

  return <SignInPage />;
}
