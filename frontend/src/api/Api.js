const baseUrl = "http://localhost:5000/";
export class Api {
    // can refactor if need to do deletes, etc to have extended by each requestType
    // need to see how cors will work in prod
    static createRequest = async (endpoint, requestType, payload) => {
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
