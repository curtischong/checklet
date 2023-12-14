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
    let userId: string | null = null;
    if (req.body.idToken !== undefined) {
        userId = await tryGetUserId(req, res);
    }

    const redisClient = await connectToRedis();

    const checkerIds = new Set(
        ...(await redisClient.sMembers("publicCheckerIds")),
    );
    if (userId !== null) {
        (await redisClient.sMembers(`users/${userId}/checkerIds`)).forEach(
            (checkerId) => {
                checkerIds.add(checkerId);
            },
        );
    }
    const checkerBlueprints = await getCheckerBlueprints(
        redisClient,
        Array.from(checkerIds),
    );

    res.status(200).json({
        checkerStorefronts: checkerBlueprints
            .filter(
                (blueprint) =>
                    blueprint.isPublic ||
                    userId === blueprint.objInfo.creatorId,
            )
            .map(checkerBlueprintToCheckerStorefront),
    });
    return;
}
