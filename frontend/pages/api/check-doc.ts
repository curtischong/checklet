import { SimpleCache } from "@api/SimpleCache";
import { Checker } from "@api/checker";
import {
    CheckBlueprint,
    CheckerBlueprint,
} from "@components/create-checker/CheckerTypes";
import { NextApiRequest, NextApiResponse } from "next";
import { getCheckBlueprints } from "pages/api/common";
import {
    connectToRedis,
    isUnauthenticatedRequestValid,
    sendBadRequest,
} from "pages/api/commonNetworking";
import * as path from "path";
import { getCheckDescForCheckIds } from "shared/checker-utils";
import { MAX_EDITOR_LEN } from "src/constants";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> {
    if (!isUnauthenticatedRequestValid(req, res)) {
        return;
    }

    const redisClient = await connectToRedis();

    const checkerId = req.body.checkerId;
    const doc = req.body.doc;
    const onlyUseCheckId = req.body.onlyUseCheckId;

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

    // TODO: if checker is private, check if user is owner. I don't want to do this rn, so ppl can share their private checkers
    // let uid: string | null = null;
    // if (req.body.idToken !== undefined) {
    //     uid = await tryGetUserId(req, res);
    // }
    // if (
    //     !checkerBlueprint.isPublic &&
    //     checkerBlueprint.objInfo.creatorId !== userId
    // ) {
    //     sendBadRequest(res, "You don't have access to this checker");
    //     return;
    // }

    let checkBlueprints: CheckBlueprint[] = [];
    if (onlyUseCheckId) {
        const rawCheckBlueprint = await redisClient.get(
            `checks/${onlyUseCheckId}`,
        );
        if (!rawCheckBlueprint) {
            sendBadRequest(
                res,
                `Check with id ${onlyUseCheckId} does not exist`,
            );
            return;
        }
        checkBlueprints = [JSON.parse(rawCheckBlueprint)];
    } else {
        checkBlueprints = await getCheckBlueprints(
            redisClient,
            checkerBlueprint,
            true,
        );
    }

    const cache = new SimpleCache(
        path.join(process.cwd(), ".chatgpt_history"),
        "/cache",
    );
    const checker = new Checker(
        checkBlueprints,
        "gpt-3.5-turbo",
        cache,
        undefined,
    );

    const suggestions = await checker.checkDoc(doc);

    const uniqueCheckIds = new Set<string>(suggestions.map((r) => r.checkId));
    const checkDescs = getCheckDescForCheckIds(checker, uniqueCheckIds);

    res.status(200).json({
        checkDescs,
        suggestions,
    });
}
