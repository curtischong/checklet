import { getCheckBlueprints } from "@/pages/api/common";
import {
    connectToRedis,
    isUnauthenticatedRequestValid,
    sendBadRequest,
} from "@/pages/api/commonNetworking";
import { CheckerBlueprint } from "@components/create-checker/CheckerTypes";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> {
    if (!isUnauthenticatedRequestValid(req, res)) {
        return;
    }

    const redisClient = await connectToRedis();

    const checkerId = req.body.checkerId;

    if (!checkerId) {
        sendBadRequest(res, "checkerId is undefined");
        return;
    }
    // we do not check to see if the user is an owner of this checker if it's private to allow ppl to share their private checkers

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

    res.status(200).json({
        checkBlueprints,
    });
}
