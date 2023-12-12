import {
    MAX_CHECKER_DESC_LEN,
    MAX_CHECKER_NAME_LEN,
    MAX_CHECKER_PLACEHOLDER_LEN,
} from "@/constants";
import { isUserCheckerOwner, validateChecker } from "@/pages/api/common";
import {
    connectToRedis,
    requestMiddleware,
    return204Status,
    sendBadRequest,
} from "@/pages/api/commonNetworking";
import { CheckerBlueprint } from "@components/create-checker/CheckerTypes";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> {
    const userId = await requestMiddleware(req, res);
    if (userId === null) {
        return;
    }
    const redisClient = await connectToRedis();

    const checkerBlueprint: CheckerBlueprint = req.body.checkerBlueprint;
    const checkerId = checkerBlueprint.objInfo.id;

    if (!(await isUserCheckerOwner(redisClient, res, userId, checkerId))) {
        return;
    }

    // verify that the checkerIds in the checkStatuses exist
    for (const checkId of Object.keys(checkerBlueprint.checkStatuses)) {
        if (!(await redisClient.exists(`checks/${checkId}`))) {
            sendBadRequest(
                res,
                `Check with id ${checkId} does not exist. Do not set it in checkStatuses`,
            );
            return;
        }
    }
    if (!validateCheckerLengths(checkerBlueprint, res)) {
        return;
    }

    if (checkerBlueprint.isPublic) {
        // validate that it's legit before we make it public
        const validationErr = await validateChecker(
            redisClient,
            userId,
            checkerBlueprint,
        );

        // do not send an error. just save it, but don't add it to the public list
        if (validationErr !== "") {
            checkerBlueprint.isPublic = false;
            await redisClient.sRem("publicCheckerIds", checkerId);
        } else {
            // https://stackoverflow.com/questions/16844188/saving-and-retrieving-array-of-strings-in-redis
            await redisClient.sAdd("publicCheckerIds", checkerId);
        }
    } else {
        await redisClient.sRem("publicCheckerIds", checkerId);
    }

    checkerBlueprint.objInfo.creatorId = userId; // override just for security purposes

    await redisClient.set(
        `checkers/${checkerId}`,
        JSON.stringify(checkerBlueprint), // TODO: compress this
    );

    return204Status(res);
}

const validateCheckerLengths = (
    checkerBlueprint: CheckerBlueprint,
    res: NextApiResponse,
): boolean => {
    const err = validateCheckerLengthsHelper(checkerBlueprint);
    if (err !== "") {
        sendBadRequest(res, err);
        return false;
    }
    return true;
};

const validateCheckerLengthsHelper = (
    checkerBlueprint: CheckerBlueprint,
): string => {
    if (checkerBlueprint.objInfo.name.length > MAX_CHECKER_NAME_LEN) {
        return `Checker name cannot be longer than ${MAX_CHECKER_NAME_LEN} characters`;
    }
    if (checkerBlueprint.objInfo.desc.length > MAX_CHECKER_DESC_LEN) {
        return `Checker description cannot be longer than ${MAX_CHECKER_DESC_LEN} characters`;
    }
    if (checkerBlueprint.placeholder.length > MAX_CHECKER_PLACEHOLDER_LEN) {
        return `Checker placeholder cannot be longer than ${MAX_CHECKER_PLACEHOLDER_LEN} characters`;
    }
    return "";
};
