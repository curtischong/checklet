import { FeedbackRequest, FeedbackResponse } from "./ApiTypes";
const baseUrl = "https://nautilus.pateldhvani.com/";
export class Api {
    // can refactor if need to do deletes, etc to have extended by each requestType
    // need to see how cors will work in prod
    static createRequest = async (
        endpoint: string,
        requestType: string,
        payload = {},
    ): Promise<any> => {
        const response = await fetch(`${baseUrl}${endpoint}`, {
            method: requestType,
            headers: {
                "Content-Type": `application/json`,
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }

        if (response.status !== 204) {
            return response.json();
        }
        return undefined;
    };
    static checkDoc = async (
        payload: FeedbackRequest,
    ): Promise<FeedbackResponse> => {
        const data = await Api.createRequest("api/checkDoc", "POST", payload);
        return data;
    };
}
