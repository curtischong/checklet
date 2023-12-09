import { Api } from "@api/apis";
import { Checker } from "@api/checker";
import {
    FeedbackResponse,
    ModelType,
} from "@components/create-checker/CheckerTypes";
import { User } from "firebase/auth";
import { toast } from "react-toastify";
import { getCheckDescForCheckIds } from "shared/checker-utils";

export const checkDocText = async (
    doc: string,
    checkerId: string,
    user: User | null,
): Promise<FeedbackResponse | undefined> => {
    const isUsingServer = localStorage.getItem("modelType") === ModelType.GPT35;
    if (isUsingServer) {
        return await Api.checkDoc(doc, checkerId, user);
    }
    const checkBlueprints = await Api.getEnabledChecks(checkerId);
    if (!checkBlueprints) {
        return undefined;
    }
    const apiKey = localStorage.getItem("openai-api-key");
    if (!apiKey) {
        toast.error(
            "No OpenAI API key found. Please set it first by clicking on the GPT-4 option in the top right",
        );
        return undefined;
    }

    const checker = new Checker(checkBlueprints, "gpt-4", undefined, apiKey);

    const suggestions = await checker.checkDoc(doc);

    const uniqueCheckIds = new Set<string>(suggestions.map((r) => r.checkId));
    const checkDescs = getCheckDescForCheckIds(checker, uniqueCheckIds);

    return {
        checkDescs,
        suggestions,
    };
};
