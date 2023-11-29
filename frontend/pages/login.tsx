import React, { useEffect } from "react";
import { GoogleAuthProvider } from "firebase/auth";
import { useClientContext } from "@utils/ClientContext";

const Login: React.FC = () => {
    const { firebaseAuth } = useClientContext();
    useEffect(() => {
        (async () => {
            const uiConfig = {
                signInSuccessUrl: "<url-to-redirect-to-on-success>",
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
                // tosUrl and privacyPolicyUrl accept either url string or a callback
                // function.
                // Terms of service url/callback.
                tosUrl: "<your-tos-url>",
                // Privacy policy url/callback.
                privacyPolicyUrl: function () {
                    window.location.assign("<your-privacy-policy-url>");
                },
            };
            // we need to import firebaseui here so it isn't loaded on the server: https://stackoverflow.com/questions/54196395/requiring-firebaseui-window-is-not-defined
            const firebaseui = await import("firebaseui");
            // Initialize the FirebaseUI Widget using Firebase.
            const ui = new firebaseui.auth.AuthUI(firebaseAuth);
            // The start method will wait until the DOM is loaded.
            // ui.start("#firebaseui-auth-container", uiConfig);
            if (ui.isPendingRedirect()) {
                ui.start("#firebaseui-auth-container", uiConfig);
            }
        })();
    }, []);

    return <div>hi</div>;
};

export default Login;
