import { NextApiRequest, NextApiResponse } from "next";
import {
    checkerBlueprintToCheckerStorefront,
    isUnauthenticatedRequestValid,
    tryGetUserId,
} from "pages/api/commonNetworking";
import { getCheckerBlueprints } from "pages/api/get-user-checkers";
import { createClient } from "redis";

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

    // https://redis.io/docs/connect/clients/nodejs/
    const redisClient = createClient();
    await redisClient.connect();

    const checkerIds = await redisClient.sMembers("publicCheckerIds");
    const checkerBlueprints = await getCheckerBlueprints(
        redisClient,
        checkerIds,
    );

    res.status(200).json({
        checkerStorefronts: checkerBlueprints
            .filter(
                (blueprint) =>
                    blueprint.isPublic || uid === blueprint.creatorId,
            )
            .map(checkerBlueprintToCheckerStorefront),
    });
    return;
}
