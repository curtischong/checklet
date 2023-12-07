import {
    CheckBlueprint,
    CheckerBlueprint,
} from "@components/create-checker/CheckerTypes";
import { NextApiRequest, NextApiResponse } from "next";
import {
    isUserCheckOwner,
    isUserCheckerOwner,
    validateCheckBlueprint,
} from "pages/api/common";
import {
    requestMiddleware,
    return204Status,
    sendBadRequest,
} from "pages/api/commonNetworking";
import { createClient } from "redis";

export default async function setCheckIsEnabled(
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> {
    const userId = await requestMiddleware(req, res);
    if (userId === null) {
        return;
    }
    const redisClient = createClient();
    await redisClient.connect();

    const checkId = req.body.checkId;
    const checkerId = req.body.checkerId;

    if (!(await isUserCheckOwner(redisClient, res, userId, checkId))) {
        return;
    }
    if (!(await isUserCheckerOwner(redisClient, res, userId, checkerId))) {
        return;
    }

    const isEnabled = req.body.isEnabled;
    if (isEnabled) {
        // if we are enabling the check, we need to make sure it's legit first
        const rawCheckBlueprint = await redisClient.get(`checks/${checkId}`);
        if (rawCheckBlueprint === null) {
            sendBadRequest(res, "Check does not exist");
            return;
        }
        const checkBlueprint: CheckBlueprint = JSON.parse(rawCheckBlueprint);

        // validate that it's legit before we make it enabled
        const validationErr = validateCheckBlueprint(checkBlueprint);
        if (validationErr !== "") {
            sendBadRequest(res, validationErr);
            return;
        }
    }

    const rawCheckerBlueprint = await redisClient.get(`checks/${checkerId}`);
    if (rawCheckerBlueprint === null) {
        sendBadRequest(res, "Checker does not exist");
        return;
    }
    const checkerBlueprint: CheckerBlueprint = JSON.parse(rawCheckerBlueprint);

    checkerBlueprint.checkStatuses[checkId].isEnabled = isEnabled;

    await redisClient.set(
        `checkers/${checkerId}`,
        JSON.stringify(checkerBlueprint),
    );
    return204Status(res);
}
