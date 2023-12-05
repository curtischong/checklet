import {
    CheckBlueprint,
    CheckType,
    CheckerBlueprint,
    CreateCheckerReq,
    validCheckTypes,
} from "@components/create-checker/CheckerTypes";
import { NextApiRequest, NextApiResponse } from "next";
import { validateBaseObjInfo } from "pages/api/common";
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

    const createCheckerReq: CreateCheckerReq = req.body.createCheckerReq;

    const validationErr = validateChecker(createCheckerReq, checkerId);
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

    // modify the checkerBlueprint so users don't pass in bad data that could be security vulnerabilities
    checkerBlueprint.creatorId = userId; // override just for security purposes
    for (const check of checkerBlueprint.checkBlueprints) {
        if (check.checkType !== CheckType.rephrase) {
            for (const example of check.positiveExamples) {
                example.editedText = ""; // clear, so users can't pass in bad data
            }
        }
    }

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

const validateChecker = async (
    redisClient: RedisClient,
    userId: string,
    createCheckerReq: CreateCheckerReq,
): Promise<string> => {
    const baseObjInfoErr = validateBaseObjInfo(createCheckerReq.baseObjInfo);
    if (baseObjInfoErr !== "") {
        return baseObjInfoErr;
    }

    if (createCheckerReq.checkIds.length === 0) {
        return "Checker must have at least one check";
    }

    for (const checkId of createCheckerReq.checkIds) {
        if (
            !(await redisClient.sIsMember(`users/${userId}/checkIds`, checkId))
        ) {
            return `You do not own the check with id ${checkId}`;
        }
    }

    // validate checks
    for (const checkId of createCheckerReq.checkIds) {
        const rawCheck = await redisClient.get(`checks/${checkId}`);
        if (rawCheck === null) {
            return `Check with id ${checkId} does not exist`;
        }
        const check = JSON.parse(rawCheck);
        const checkValidationErr = validateCheck(check);
        if (checkValidationErr !== "") {
            return checkValidationErr;
        }
    }

    return "";
};
