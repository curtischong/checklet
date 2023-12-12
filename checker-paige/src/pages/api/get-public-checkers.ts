import { checkerBlueprintToCheckerStorefront } from "@/pages/api/common";
import {
    connectToRedis,
    isUnauthenticatedRequestValid,
    tryGetUserId,
} from "@/pages/api/commonNetworking";
import { getCheckerBlueprints } from "@/pages/api/get-user-checkers";
import { NextApiRequest, NextApiResponse } from "next";

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

    const checkerIds = await redisClient.sMembers("publicCheckerIds");
    const checkerBlueprints = await getCheckerBlueprints(
        redisClient,
        checkerIds,
    );

    res.status(200).json({
        checkerStorefronts: checkerBlueprints
            .filter(
                (blueprint) =>
                    blueprint.isPublic || uid === blueprint.objInfo.creatorId,
            )
            .map(checkerBlueprintToCheckerStorefront),
    });
    return;
}
