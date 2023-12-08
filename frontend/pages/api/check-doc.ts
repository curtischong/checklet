import { Checker } from "@api/checker";
import {
    CheckDescObj,
    CheckerBlueprint,
} from "@components/create-checker/CheckerTypes";
import { NextApiRequest, NextApiResponse } from "next";
import { getCheckBlueprints } from "pages/api/common";
import {
    isUnauthenticatedRequestValid,
    sendBadRequest,
} from "pages/api/commonNetworking";
import { createClient } from "redis";
import { MAX_EDITOR_LEN } from "src/constants";

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
    if (doc.length > MAX_EDITOR_LEN) {
        sendBadRequest(
            res,
            `doc is too long. It must be within ${MAX_EDITOR_LEN} characters`,
        );
        return;
    }

    const rawCheckerBlueprint = await redisClient.get(`checkers/${checkerId}`);
    if (!rawCheckerBlueprint) {
        sendBadRequest(res, "Checker does not exist");
        return;
    }
    const checkerBlueprint: CheckerBlueprint = JSON.parse(rawCheckerBlueprint);

    const checkBlueprints = await getCheckBlueprints(
        redisClient,
        checkerBlueprint,
        true,
    );
    const checker = new Checker(checkerBlueprint, checkBlueprints);

    const suggestions = await checker.checkDoc(doc);

    const uniqueCheckIds = new Set<string>(suggestions.map((r) => r.checkId));
    const checkDescs = getCheckDescForCheckIds(checker, uniqueCheckIds);

    res.status(200).json({
        checkDescs,
        suggestions,
    });
}

const getCheckDescForCheckIds = (
    checker: Checker,
    uniqueCheckIds: Set<string>,
): CheckDescObj => {
    const checkDescObj: CheckDescObj = {};

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
        checkDescObj[checkId] = {
            objInfo: checkBlueprint.objInfo,
            checkType: checkBlueprint.checkType,
            category: checkBlueprint.category,
            positiveExamples: checkBlueprint.positiveExamples,
        };
    }
    return checkDescObj;
};
