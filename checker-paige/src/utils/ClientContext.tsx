import React from "react";

// good tutorial: https://www.freecodecamp.org/news/use-firebase-authentication-in-a-react-app/
// good tutorial2: https://medium.com/geekculture/firebase-auth-with-react-and-typescript-abeebcd7940a
// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, User, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
    apiKey: "AIzaSyBbm_Y6czGlH0dbpTeTEyUafNIt4n9_zdY",
    authDomain: "yourwriterfriend-1d691.firebaseapp.com",
    projectId: "yourwriterfriend-1d691",
    storageBucket: "yourwriterfriend-1d691.appspot.com",
    messagingSenderId: "218748045222",
    appId: "1:218748045222:web:b93a3b505a8b70dad23167",
    measurementId: "G-G7J8GPNXXQ",
};

export interface ClientContext {
    firebaseApp: FirebaseApp;
    firebaseAuth: Auth;
    firestore: Firestore;
    user: User | null;
}

export interface ClientContextReact {
    clientContext: ClientContext | null;
}

// Create a context
const ClientContextReactContext = React.createContext<ClientContextReact>({
    clientContext: null,
});

// Create a provider component
export const ClientContextProvider = ({
    children,
}: {
    children: React.ReactNode | React.ReactNode[];
}): JSX.Element => {
    console.log("ClientContextProvider");
    const [value, setValue] = React.useState<ClientContextReact | undefined>();

    React.useEffect(() => {
        const firebaseApp = initializeApp(firebaseConfig);
        const firebaseAuth = getAuth(firebaseApp);
        // const analytics = getAnalytics(firebaseApp);
        const firestore = getFirestore(firebaseApp);

        const unsubscribe = firebaseAuth.onAuthStateChanged((firebaseUser) => {
            // only set the value after the user's login status is known, so we render the page knowing
            setValue({
                clientContext: {
                    firebaseApp: firebaseApp,
                    firebaseAuth: firebaseAuth,
                    firestore,
                    user: firebaseUser,
                },
            });
        });
        return unsubscribe;
    }, []);

    if (value) {
        return (
            <ClientContextReactContext.Provider value={value}>
                {children}
            </ClientContextReactContext.Provider>
        );
    }
    return <></>;
};

export const useClientContext = (): ClientContext => {
    const context = React.useContext(ClientContextReactContext).clientContext;
    if (!context) {
        throw new Error(
            "useClientContext must be used within a ClientProvider",
        );
    }
    return context;
};

export default ClientContext;
