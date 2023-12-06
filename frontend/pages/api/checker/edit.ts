import {
    CheckBlueprint,
    CheckType,
    CheckerBlueprint,
    CreateCheckerReq,
    validCheckTypes,
} from "@components/create-checker/CheckerTypes";
import { NextApiRequest, NextApiResponse } from "next";
import { isUserCheckerOwner, validateObjInfo } from "pages/api/common";
import {
    RedisClient,
    requestMiddleware,
    return204Status,
    sendBadRequest,
} from "pages/api/commonNetworking";
import { createClient } from "redis";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> {
    const userId = await requestMiddleware(req, res);
    if (userId === null) {
        return;
    }
    // https://redis.io/docs/connect/clients/nodejs/
    const redisClient = createClient();
    await redisClient.connect();

    const checkerBlueprint: CheckerBlueprint = req.body.checkerBlueprint;
    const checkerId = checkerBlueprint.objInfo.id;

    if (!(await isUserCheckerOwner(redisClient, res, userId, checkerId))) {
        return;
    }

    if (checkerBlueprint.isPublic) {
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

        await redisClient.sAdd("publicCheckerIds", req.body.checkerId);
    }

    checkerBlueprint.objInfo.creatorId = userId; // override just for security purposes

    await redisClient.set(
        `checkers/${checkerId}`,
        JSON.stringify(checkerBlueprint), // TODO: compress this
    );

    return204Status(res);
}

const validateChecker = async (
    redisClient: RedisClient,
    userId: string,
    checkerBlueprint: CheckerBlueprint,
): Promise<string> => {
    const objInfoErr = validateObjInfo(checkerBlueprint.objInfo);
    if (objInfoErr !== "") {
        return objInfoErr;
    }

    const checkIds = Object.keys(checkerBlueprint.checkStatuses);
    if (checkIds.length === 0) {
        return "Checker must have at least one check";
    }

    // PERF: batch this
    for (const checkId of checkIds) {
        if (
            !(await redisClient.sIsMember(`users/${userId}/checkIds`, checkId))
        ) {
            return `You do not own the check with id ${checkId}`;
        }
    }

    // we don't need to validate checks. Since we validate them before they are enabled
    return "";
};
