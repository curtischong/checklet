import { CheckerId } from "@api/checker";
import {
    CheckerBlueprint,
    CheckerStorefront,
    FeedbackResponse,
} from "@components/create-checker/CheckerTypes";
import { toast } from "react-toastify";
const baseUrl = "http://localhost:3000/"; // TODO: replace with the proper url. we should inject it from the env
export class Api {
    // can refactor if need to do deletes, etc to have extended by each requestType
    // need to see how cors will work in prod
    static createRequest = async (
        endpoint: string,
        requestType: string,
        payload = {},
    ): Promise<any> => {
        let response;
        try {
            response = await fetch(`${baseUrl}${endpoint}`, {
                method: requestType,
                headers: {
                    "Content-Type": `application/json`,
                },
                body: JSON.stringify(payload),
            });
        } catch (err) {
            toast.error(err.toString());
            return undefined;
        }

        if (!response.ok) {
            let errMsg = response.statusText;
            try {
                const responseText = JSON.parse(await response.text());
                errMsg = responseText.errorMsg;
            } catch (err) {
                console.error("couldn't parse response text", err);
            }
            toast.error(errMsg);
            return;
        }

        if (response.status !== 204) {
            return response.json();
        }
        return undefined;
    };

    static checkDoc = async (
        doc: string,
        checkerId: CheckerId,
    ): Promise<FeedbackResponse> => {
        const data = await Api.createRequest("api/check-doc", "POST", {
            doc,
            checkerId,
        });
        return data;
    };

    static fetchCheckerBlueprint = async (
        idToken: string,
        checkerId: CheckerId,
    ): Promise<CheckerBlueprint | undefined> => {
        const data = await Api.createRequest("api/checker-blueprint", "POST", {
            idToken,
            checkerId,
        });
        return data?.checkerBlueprint;
    };

    static userCheckerBlueprints = async (
        idToken: string,
    ): Promise<CheckerBlueprint[]> => {
        const data = await Api.createRequest("api/user-checkers", "POST", {
            idToken,
        });
        return data.checkerBlueprints;
    };

    static createChecker = async (
        blueprint: CheckerBlueprint,
        checkerId: CheckerId,
        idToken: string,
    ): Promise<void> => {
        Api.createRequest("api/create-checker", "POST", {
            blueprint,
            checkerId,
            idToken,
        });
    };

    static deleteChecker = async (
        checkerId: CheckerId,
        idToken: string,
    ): Promise<void> => {
        Api.createRequest("api/delete-checker", "POST", {
            checkerId,
            idToken,
        });
    };

    static publicChecks = async (): Promise<
        CheckerStorefront[] | undefined
    > => {
        const data = await Api.createRequest("api/public-checks", "POST", {});
        return data?.checkerStorefronts;
    };

    static getCheckerStorefront = async (
        checkerId: CheckerId,
    ): Promise<CheckerStorefront | undefined> => {
        const data = await Api.createRequest(
            "api/get-checker-storefront",
            "POST",
            {
                checkerId,
            },
        );
        return data?.checkerStorefront;
    };
}
