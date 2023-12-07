import { CheckBlueprint } from "@components/create-checker/CheckerTypes";
import { NextApiRequest, NextApiResponse } from "next";
import { isUserCheckOwner, validateCheckBlueprint } from "pages/api/common";
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

    const checkId = req.body.checkId;
    const redisClient = createClient();
    await redisClient.connect();
    if (!(await isUserCheckOwner(redisClient, res, userId, checkId))) {
        return;
    }
    const isEnabled = req.body.isEnabled;
    const rawCheckBlueprint = await redisClient.get(`checks/${checkId}`);
    if (rawCheckBlueprint === null) {
        sendBadRequest(res, "Check does not exist");
        return;
    }
    const checkBlueprint: CheckBlueprint = JSON.parse(rawCheckBlueprint);

    if (isEnabled) {
        // validate that it's legit before we make it enabled
        const validationErr = validateCheckBlueprint(checkBlueprint);
        if (validationErr !== "") {
            sendBadRequest(res, validationErr);
            return;
        }
    }

    checkBlueprint.isEnabled = isEnabled;
    await redisClient.set(`checks/${checkId}`, JSON.stringify(checkBlueprint));
    return204Status(res);
}
