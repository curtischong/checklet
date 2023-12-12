import { isUserCheckerOwner, validateChecker } from "@/pages/api/common";
import {
    connectToRedis,
    requestMiddleware,
    return204Status,
    sendBadRequest,
} from "@/pages/api/commonNetworking";
import { CheckerBlueprint } from "@components/create-checker/CheckerTypes";
import { NextApiRequest, NextApiResponse } from "next";

export default async function setCheckerIsPublic(
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> {
    const userId = await requestMiddleware(req, res);
    if (userId === null) {
        return;
    }

    const checkerId = req.body.checkerId;
    const redisClient = await connectToRedis();
    if (!(await isUserCheckerOwner(redisClient, res, userId, checkerId))) {
        return;
    }
    const isPublic = req.body.isPublic;
    const rawCheckerBlueprint = await redisClient.get(`checkers/${checkerId}`);
    if (rawCheckerBlueprint === null) {
        sendBadRequest(res, "Checker does not exist");
        return;
    }
    const checkerBlueprint: CheckerBlueprint = JSON.parse(rawCheckerBlueprint);

    if (isPublic) {
        // validate that it's legit before we make it public
        const validationErr = await validateChecker(
            redisClient,
            userId,
            checkerBlueprint,
        );
        if (validationErr !== "") {
            sendBadRequest(res, validationErr);
            return;
        }
    }

    if (isPublic) {
        await redisClient.sAdd("publicCheckerIds", checkerId);
    } else {
        await redisClient.sRem("publicCheckerIds", checkerId);
    }

    checkerBlueprint.isPublic = isPublic;
    await redisClient.set(
        `checkers/${checkerId}`,
        JSON.stringify(checkerBlueprint),
    );
    return204Status(res);
}
