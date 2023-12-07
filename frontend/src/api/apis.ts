import { CheckerId } from "@api/checker";
import {
    CheckBlueprint,
    CheckId,
    CheckType,
    CheckerBlueprint,
    CheckerStorefront,
    FeedbackResponse,
} from "@components/create-checker/CheckerTypes";
import { User } from "firebase/auth";
import { toast } from "react-toastify";
const baseUrl = "http://localhost:3000/"; // TODO: replace with the proper url. we should inject it from the env
export class Api {
    // can refactor if need to do deletes, etc to have extended by each requestType
    // need to see how cors will work in prod
    static createRequest = async (
        endpoint: string,
        requestType: string,
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        payload: any,
        user?: User | null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<any> => {
        if (user) {
            const idToken = await user.getIdToken();
            payload.idToken = idToken;
        }
        let response;
        try {
            response = await fetch(`${baseUrl}${endpoint}`, {
                method: requestType,
                headers: {
                    "Content-Type": `application/json`,
                },
                body: JSON.stringify(payload),
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
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
        return { success: true };
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
        checkerId: CheckerId,
        user: User,
    ): Promise<
        | {
              checkerBlueprint: CheckerBlueprint;
              checkBlueprints: CheckBlueprint[];
          }
        | undefined
    > => {
        const data = await Api.createRequest(
            "api/checker/get-blueprint-and-checks",
            "POST",
            {
                checkerId,
            },
            user,
        );
        if (!data) {
            return undefined;
        }
        return data;
    };

    static fetchCheckBlueprint = async (
        checkId: CheckId,
        user: User,
    ): Promise<CheckBlueprint | undefined> => {
        const data = await Api.createRequest(
            "api/check/get-blueprint",
            "POST",
            {
                checkId,
            },
            user,
        );
        return data?.checkBlueprint;
    };

    static userCheckerBlueprints = async (
        user: User,
    ): Promise<CheckerBlueprint[] | undefined> => {
        const data = await Api.createRequest(
            "api/get-user-checkers",
            "POST",
            {},
            user,
        );
        return data?.checkerBlueprints;
    };

    static createCheck = async (
        checkerId: CheckerId,
        name: string,
        checkType: CheckType,
        user: User,
    ): Promise<CheckId> => {
        const res = await Api.createRequest(
            "api/check/create",
            "POST",
            {
                checkerId,
                name,
                checkType,
            },
            user,
        );
        return res?.checkId;
    };

    static createChecker = async (
        user: User,
    ): Promise<CheckerId | undefined> => {
        const res = await Api.createRequest(
            "api/checker/create",
            "POST",
            {},
            user,
        );
        return res?.checkerId;
    };

    static editCheck = async (
        checkBlueprint: CheckBlueprint,
        user: User,
    ): Promise<boolean> => {
        const res = await Api.createRequest(
            "api/check/edit",
            "POST",
            {
                checkBlueprint,
            },
            user,
        );
        return res !== undefined;
    };

    static editChecker = async (
        checkerBlueprint: CheckerBlueprint,
        user: User,
    ): Promise<boolean> => {
        const res = await Api.createRequest(
            "api/checker/edit",
            "POST",
            { checkerBlueprint },
            user,
        );
        return res !== undefined;
    };

    static deleteCheck = async (
        checkerId: CheckerId,
        checkId: CheckId,
        user: User,
    ): Promise<boolean> => {
        const res = Api.createRequest(
            "api/check/delete",
            "POST",
            {
                checkerId,
                checkId,
            },
            user,
        );
        return res !== undefined;
    };

    static deleteChecker = async (
        checkerId: CheckerId,
        user: User,
    ): Promise<void> => {
        return Api.createRequest(
            "api/checker/delete",
            "POST",
            {
                checkerId,
            },
            user,
        );
    };

    static getPublicCheckers = async (
        user: User | null,
    ): Promise<CheckerStorefront[] | undefined> => {
        const data = await Api.createRequest(
            "api/get-public-checkers",
            "POST",
            {},
            user,
        );
        return data?.checkerStorefronts;
    };

    static getCheckerStorefront = async (
        checkerId: CheckerId,
        user: User | null,
    ): Promise<CheckerStorefront | undefined> => {
        const data = await Api.createRequest(
            "api/checker/get-storefront",
            "POST",
            {
                checkerId,
            },
            user,
        );
        return data?.checkerStorefront;
    };

    static setCheckerIsPublic = async (
        checkerId: CheckerId,
        isPublic: boolean,
        user: User,
    ): Promise<boolean> => {
        const res = await Api.createRequest(
            "api/checker/set-is-public",
            "POST",
            {
                checkerId,
                isPublic,
            },
            user,
        );
        return res !== undefined;
    };

    static setCheckIsEnabled = async (
        checkId: CheckId,
        isEnabled: boolean,
        user: User,
    ): Promise<boolean> => {
        const res = await Api.createRequest(
            "api/check/set-is-enabled",
            "POST",
            {
                checkId,
                isEnabled,
            },
            user,
        );
        return res !== undefined;
    };
}
