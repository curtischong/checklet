import {
    CheckBlueprint,
    CheckId,
    CheckType,
    CheckerBlueprint,
    CreateCheckReq,
    validCheckTypes,
} from "@components/create-checker/CheckerTypes";
import { createUniqueId } from "@utils/strings";
import { NextApiRequest, NextApiResponse } from "next";
import { isUserCheckerOwner, validateBaseObjInfo } from "pages/api/common";
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

    const createCheckReq: CreateCheckReq = req.body.createCheckReq;

    const validationErr = validateCreateCheckReq(createCheckReq);
    if (validationErr !== "") {
        sendBadRequest(res, validationErr);
        return;
    }

    const checkId = createUniqueId(); // TODO: validate that the id wasn't used before
    if (
        !(await addCheckToChecker(
            redisClient,
            createCheckReq,
            res,
            userId,
            checkId,
        ))
    ) {
        return;
    }

    const positiveExamples = createCheckReq.positiveExamples;
    for (const example of positiveExamples) {
        if (createCheckReq.checkType !== CheckType.rephrase) {
            example.editedText = ""; // clear, so users can't pass in bad data
        }
    }

    const checkBlueprint: CheckBlueprint = {
        objInfo: {
            name: createCheckReq.baseObjInfo.name,
            desc: createCheckReq.baseObjInfo.desc,
            id: checkId,
            creatorId: userId,
        },
        checkType: createCheckReq.checkType,
        instruction: createCheckReq.instruction,
        category: createCheckReq.category,
        positiveExamples,
        isEnabled: true,
    };

    await redisClient.set(
        `checks/${checkId}`,
        JSON.stringify(checkBlueprint), // TODO: compress this
    );

    // instead of json.stringifying an array, we use a set
    // https://stackoverflow.com/questions/16844188/saving-and-retrieving-array-of-strings-in-redis
    const checkIdsKey = `users/${userId}/checkIds`;
    const checkIds = await redisClient.sMembers(checkIdsKey);
    if (checkIds.length >= 100) {
        sendBadRequest(res, "You can only have 100 checks");
        return;
    }
    await redisClient.sAdd(checkIdsKey, checkId);

    return204Status(res);
}

// returns success
const addCheckToChecker = async (
    redisClient: RedisClient,
    createCheckReq: CreateCheckReq,
    res: NextApiResponse,
    userId: string,
    checkId: CheckId,
): Promise<boolean> => {
    // make sure you are attaching this check to a checker that you own
    const checkerId = createCheckReq.checkerId;
    if (!(await isUserCheckerOwner(redisClient, res, userId, checkerId))) {
        return false;
    }

    const rawCheckerBlueprint = await redisClient.get(`checkers/${checkerId}`);
    if (rawCheckerBlueprint === null) {
        sendBadRequest(
            res,
            `Checker with id=${checkerId} does not exist. This means the system is in a bad state. Contact Curtis!`,
        );
        return false;
    }

    const checkerBlueprint: CheckerBlueprint = JSON.parse(rawCheckerBlueprint);
    checkerBlueprint.checkStatuses.push({
        checkId,
        isEnabled: true,
    });
    await redisClient.set(
        `checkers/${checkerId}`,
        JSON.stringify(checkerBlueprint),
    );
    return true;
};

const validateCreateCheckReq = (createCheckReq: CreateCheckReq): string => {
    const validateBaseObjInfoErr = validateBaseObjInfo(
        createCheckReq.baseObjInfo,
    );
    if (validateBaseObjInfoErr !== "") {
        return validateBaseObjInfoErr;
    }

    if (createCheckReq.instruction === "") {
        return "Check instruction cannot be empty";
    } else if (!validCheckTypes.includes(createCheckReq.checkType)) {
        return `Check type must be one of [${validCheckTypes.join(
            ", ",
        )}]. Got ${createCheckReq.checkType}`;
    } else if (createCheckReq.positiveExamples.length === 0) {
        return "Check must have at least one positive example";
    }

    return validatePositiveExamples(createCheckReq);
};

const validatePositiveExamples = (createCheckReq: CreateCheckReq) => {
    for (const example of createCheckReq.positiveExamples) {
        if (example.originalText === "") {
            return "Positive example original text cannot be empty";
        }
    }
    return "";
};
