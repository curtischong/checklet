import { CheckerBlueprint } from "@components/create-checker/CheckerTypes";
import { NextApiRequest, NextApiResponse } from "next";
import { checkerBlueprintToCheckerStorefront } from "pages/api/common";
import {
    connectToRedis,
    isUnauthenticatedRequestValid,
    tryGetUserId,
} from "pages/api/commonNetworking";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> {
    if (!isUnauthenticatedRequestValid(req, res)) {
        return;
    }
    let uid: string | null = null;
    if (req.body.idToken !== undefined) {
        uid = await tryGetUserId(req, res);
    }

    const redisClient = await connectToRedis();

    const checkerId = req.body.checkerId;

    const rawCheckerBlueprint = await redisClient.get(`checkers/${checkerId}`);
    if (rawCheckerBlueprint === null) {
        // do not send bad request since we already know it errored out. we don't want to show the error toast
        res.status(200).json({
            checkerStorefront: undefined,
        });
        return;
    }
    const checkerBlueprint: CheckerBlueprint = JSON.parse(rawCheckerBlueprint);
    if (
        !checkerBlueprint.isPublic &&
        checkerBlueprint.objInfo.creatorId !== uid
    ) {
        // do not send bad request since we already know it errored out. we don't want to show the error toast
        res.status(200).json({
            checkerStorefront: undefined,
        });
        return;
    }

    const checkerStorefront =
        checkerBlueprintToCheckerStorefront(checkerBlueprint);

    res.status(200).json({
        checkerStorefront,
    });
    return;
}
