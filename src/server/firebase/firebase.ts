import { clientConfig } from "@/server/firebase/config";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
export const app = initializeApp(clientConfig);
export const auth = getAuth(app);
