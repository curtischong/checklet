import { CheckerStorefront } from "@components/CheckerStore";
import { CheckerBlueprint } from "@components/create-checker/CheckerCreator";
import { NextApiRequest, NextApiResponse } from "next";
import { isUnauthenticatedRequestValid } from "pages/api/common";
import { getCheckerBlueprints } from "pages/api/user-checkers";
import { createClient } from "redis";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> {
    if (!isUnauthenticatedRequestValid(req, res)) {
        return;
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
        checkerStorefronts:
            checkerBlueprintsToCheckerPreviews(checkerBlueprints),
    });
    return;
}

const checkerBlueprintsToCheckerPreviews = (
    checkerBlueprints: CheckerBlueprint[],
): CheckerStorefront[] => {
    return checkerBlueprints.map((blueprint) => ({
        id: blueprint.id,
        name: blueprint.name,
        desc: blueprint.desc,
        creatorId: blueprint.creatorId,
    }));
};
