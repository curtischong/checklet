import { Checker } from "@api/checker";
import { CheckDesc } from "@components/create-checker/CheckerTypes";
import { NextApiRequest, NextApiResponse } from "next";
import {
    isUnauthenticatedRequestValid,
    sendBadRequest,
} from "pages/api/common";
import { createClient } from "redis";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> {
    if (!isUnauthenticatedRequestValid(req, res)) {
        return;
    }

    const redisClient = createClient();
    await redisClient.connect();

    const checkerId = req.body.checkerId;
    const doc = req.body.doc;

    if (!checkerId) {
        sendBadRequest(res, "checkerId is undefined");
        return;
    }
    if (!doc) {
        sendBadRequest(res, "doc is undefined");
        return;
    }

    const rawCheckerBlueprint = await redisClient.get(`checkers/${checkerId}`);
    if (!rawCheckerBlueprint) {
        sendBadRequest(res, "Checker does not exist");
        return;
    }
    const checkerBlueprint = JSON.parse(rawCheckerBlueprint);
    const checker = new Checker(checkerBlueprint);

    const suggestions = await checker.checkDoc(doc);

    const uniqueCheckIds = new Set<string>(suggestions.map((r) => r.checkId));
    const checkDescs = getCheckDescForCheckIds(checker, uniqueCheckIds);

    res.status(204);
    res.status(200).json({
        checkDescs,
        suggestions,
    });
}

const getCheckDescForCheckIds = (
    checker: Checker,
    uniqueCheckIds: Set<string>,
): CheckDesc[] => {
    const checkDescs: CheckDesc[] = [];
    for (const checkId of uniqueCheckIds) {
        console.log("checkId", checkId);
        const checkBlueprint = checker.checks.get(checkId)?.blueprint;
        if (!checkBlueprint) {
            console.error(
                "[check-doc] cannot find checkBlueprint for checkId",
                checkId,
            );
            continue;
        }
        checkDescs.push({
            name: checkBlueprint.name,
            longDesc: checkBlueprint.longDesc,
            category: checkBlueprint.category,
            positiveExamples: checkBlueprint.positiveExamples,
            checkId,
        });
    }
    return checkDescs;
};
