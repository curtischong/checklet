import { RegisterBox } from "@/app/register/RegisterBox";
import { SignInPageBackground } from "@/app/signin/SignInPageBackground";
import { trackPageView } from "@/mixpanel";

export default function Page() {
  // TODO: what to do if the user is already signed in?
  // this should be handled in the middleware. redirect to /checkers
  trackPageView();

  return (
    <SignInPageBackground>
      <div className="mb-4 text-center">
        Want to create a checker? Sign in/sign up below!
      </div>
      <RegisterBox />
    </SignInPageBackground>
  );
}
