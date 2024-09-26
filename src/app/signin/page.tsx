import SignInBox from "@/app/signin/SignInBox";
import { SignInPageBackground } from "@/app/signin/SignInPageBackground";
import { trackPageView } from "@/mixpanel";

export default function Page() {
  // TODO: what to do if the user is already signed in?
  // this should be handled in the middleware. redirect to /checkers

  trackPageView();
  return (
    <SignInPageBackground>
      <SignInBox />
    </SignInPageBackground>
  );
}
