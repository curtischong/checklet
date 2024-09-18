import { clientConfig } from "@/server/firebase/config";
import { initializeApp } from "firebase/app";
export const app = initializeApp(clientConfig);
