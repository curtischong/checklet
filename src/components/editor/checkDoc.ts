import { getCheckDescForCheckIds } from "@/shared/checker-utils";
import { Api } from "@api/apis";
import { Checker, CheckerId } from "@api/checker";
import {
    CheckBlueprint,
    CheckId,
    FeedbackResponse,
    ModelType,
} from "@components/create-checker/CheckerTypes";
import { User } from "firebase/auth";
import { toast } from "react-toastify";

export const checkDocText = async (
    doc: string,
    checkerId: CheckerId,
    user: User | null,
    onlyUseCheckId: CheckId | undefined,
): Promise<FeedbackResponse | undefined> => {
    const isUsingServer =
        (localStorage.getItem("modelType") ?? ModelType.GPT35) ===
        ModelType.GPT35;
    if (isUsingServer) {
        try {
            return await Api.checkDoc(doc, checkerId, user, onlyUseCheckId);
        } catch (err) {
            toast.error(`Error checking doc ${err}`);
            console.error(err);
            return undefined;
        }
    }
    let checkBlueprints: CheckBlueprint[] = [];
    if (onlyUseCheckId) {
        if (!user) {
            toast.error("You must be logged in to test a checkId");
            return;
        }
        const rawCheckBlueprint = await Api.getCheckBlueprint(
            onlyUseCheckId,
            user,
        );
        if (!rawCheckBlueprint) {
            return undefined;
        }
        checkBlueprints = [rawCheckBlueprint];
    } else {
        const rawCheckBlueprints = await Api.getEnabledChecks(checkerId);
        if (!rawCheckBlueprints) {
            return undefined;
        }
        checkBlueprints = rawCheckBlueprints;
    }

    const apiKey = localStorage.getItem("openai-api-key");
    if (!apiKey) {
        toast.error(
            "No OpenAI API key found. Please set it first by clicking on the GPT-4o option in the top right",
        );
        return undefined;
    }

    const checker = new Checker(checkBlueprints, "gpt-4o", undefined, apiKey);

    const suggestions = await checker.checkDoc(doc);

    const uniqueCheckIds = new Set<string>(suggestions.map((r) => r.checkId));
    const checkDescs = getCheckDescForCheckIds(checker, uniqueCheckIds);

    return {
        checkDescs,
        suggestions,
    };
};
