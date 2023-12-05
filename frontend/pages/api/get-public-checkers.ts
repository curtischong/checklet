import { CheckerStorefront } from "@components/CheckerStore";
import { CheckerBlueprint } from "@components/create-checker/CheckerCreator";
import { UserIdentifier } from "firebase-admin/auth";
import { NextApiRequest, NextApiResponse } from "next";
import {
    checkerBlueprintToCheckerStorefront,
    isUnauthenticatedRequestValid,
    tryGetUserId,
} from "pages/api/common";
import { getCheckerBlueprints } from "pages/api/user-checkers";
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
    console.log(uid);

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
