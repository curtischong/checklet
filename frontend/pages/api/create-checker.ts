import {
    CheckBlueprint,
    CheckerBlueprint,
    validCheckTypes,
} from "@components/create-checker/CheckerTypes";
import { NextApiRequest, NextApiResponse } from "next";
import {
    requestMiddleware,
    return204Status,
    sendBadRequest,
} from "pages/api/common";
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
    const checkerBlueprint: CheckerBlueprint = req.body.blueprint;
    const checkerId = req.body.checkerId;

    const validationErr = validateChecker(checkerBlueprint, checkerId);
    if (validationErr !== "") {
        sendBadRequest(res, validationErr);
        return;
    }
    const existingChecker = await redisClient.get(`checkers/${checkerId}`);
    if (existingChecker !== null) {
        if (JSON.parse(existingChecker).creatorId !== userId) {
            sendBadRequest(
                res,
                `You are not the creator of this checker. You cannot edit it.`,
            );
            return;
        }
    }

    checkerBlueprint.creatorId = userId; // override just for security purposes
    await redisClient.set(
        `checkers/${checkerId}`,
        JSON.stringify(checkerBlueprint), // TODO: compress this
    );

    // instead of json.stringifying an array, we use a set
    // https://stackoverflow.com/questions/16844188/saving-and-retrieving-array-of-strings-in-redis
    const checkerIdsKey = `users/${userId}/checkerIds`;
    const checkerIds = await redisClient.sMembers(checkerIdsKey);
    if (checkerIds.includes(checkerId)) {
        // The user is probably trying to edit an existing checker. this checker is already in checkerIds
        res.status(200).json({ status: "success" });
        return;
    }
    if (checkerIds.length >= 7) {
        sendBadRequest(res, "You can only have 7 checkers");
        return;
    }
    await redisClient.sAdd(checkerIdsKey, checkerId);
    await redisClient.sAdd("publicCheckerIds", checkerId);

    return204Status(res);
}

const validateCheck = (blueprint: CheckBlueprint): string => {
    if (blueprint.name === "") {
        return "Check name cannot be empty";
    } else if (blueprint.desc === "") {
        return "Check description cannot be empty";
    } else if (blueprint.instruction === "") {
        return "Check instruction cannot be empty";
    } else if (!validCheckTypes.includes(blueprint.checkType)) {
        return `Check type must be one of [${validCheckTypes.join(
            ", ",
        )}]. Got ${blueprint.checkType}`;
    } else if (blueprint.positiveExamples.length === 0) {
        return "Check must have at least one positive example";
    }
    return "";
};

const validateChecker = (
    blueprint: CheckerBlueprint,
    checkerId: string,
): string => {
    if (blueprint.name === "") {
        return "Checker description cannot be empty";
    } else if (blueprint.desc === "") {
        return "Checker description cannot be empty";
    } else if (blueprint.checkBlueprints.length === 0) {
        return "Checker must have at least one check";
    } else if (checkerId.length !== 64) {
        return `Checker id=${checkerId} must be 64 characters long`;
    }

    // validate checks
    for (const check of blueprint.checkBlueprints) {
        const checkValidationErr = validateCheck(check);
        if (checkValidationErr !== "") {
            return checkValidationErr;
        }
    }

    return "";
};
