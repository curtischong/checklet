import { useRouter } from "next/router";
import { useEffect } from "react";

// const router = useRouter();

// const baseUrl = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ?
// "https://nautilus-fydp.herokuapp.com/" : "https://nautilus-fydp.herokuapp.com/";
const baseUrl = "https://localhost:5000";
export class Api {
    static createRequest = (endpoint, requestType, payload) =>
        new Promise((resolve, reject) => {
            console.log(baseUrl);
            try {
                const response = fetch(`${baseUrl}${endpoint}`, {
                    method: requestType,
                    mode: "no-cors",
                    headers: {
                        "Content-Type": `application/json`,
                    },
                    body: payload,
                });
                resolve(response.data);
            } catch (e) {
                const {
                    response: { data },
                } = e;
                reject(data);
            }
        });

    static structureSuggestions = async (payload) => {
        const data = await Api.createRequest(
            "resumes/structure/suggestions",
            "POST",
            payload,
        );
        return data;
    };

    static analyzeResume = async (payload) => {
        const data = await Api.createRequest(
            "resumes/feedback",
            "POST",
            payload,
        );
        return data;
    };
}
