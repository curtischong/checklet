import React, { useEffect } from "react";
import { GoogleAuthProvider } from "firebase/auth";
import { useClientContext } from "@utils/ClientContext";
import { AuthBoxCss } from "pages/login/authBoxCss";
import { useRouter } from "next/router";
import { TextButton } from "@components/Button";

const Login: React.FC = () => {
    const { firebaseAuth } = useClientContext();
    const router = useRouter();
    useEffect(() => {
        (async () => {
            const uiConfig = {
                signInSuccessUrl: "/dashboard",
                signInOptions: [
                    // Leave the lines as is for the providers you want to offer your users.
                    GoogleAuthProvider.PROVIDER_ID,
                    // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                    // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
                    // firebase.auth.GithubAuthProvider.PROVIDER_ID,
                    // firebase.auth.EmailAuthProvider.PROVIDER_ID,
                    // firebase.auth.PhoneAuthProvider.PROVIDER_ID,
                    // firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID,
                ],
                tosUrl: () => {
                    router.push("/terms-of-service");
                },
                privacyPolicyUrl: () => {
                    router.push("/privacy-policy");
                },
            };

            // we need to import firebaseui here (rather at the top) so it isn't loaded on the server
            // https://stackoverflow.com/questions/54196395/requiring-firebaseui-window-is-not-defined
            const firebaseui = await import("firebaseui");
            // Initialize the FirebaseUI Widget using Firebase.
            const ui =
                firebaseui.auth.AuthUI.getInstance() ||
                new firebaseui.auth.AuthUI(firebaseAuth);
            // The start method will wait until the DOM is loaded.
            ui.start("#firebaseui-auth-container", uiConfig);
            // if (!ui.isPendingRedirect()) {
            //     ui.start("#firebaseui-auth-container", uiConfig);
            // }
        })();
    }, []);

    return (
        <div className="flex flex-col justify-center">
            <div className="mt-60 mb-4">
                <h1 className="text-4xl font-bold text-center">
                    Your Writer Friend
                </h1>
            </div>
            <TextButton
                className="mx-auto mb-4"
                onClick={() => {
                    router.push("/editor");
                }}
            >
                Go to Editor
            </TextButton>
            <div className="text-center">
                Want to create a checker? Sign in below!
            </div>
            <div id="firebaseui-auth-container"></div>
            <AuthBoxCss />
        </div>
    );
};

export default Login;
