import {
    CheckBlueprint,
    CheckType,
} from "@components/create-checker/CheckerTypes";
import { NextApiRequest, NextApiResponse } from "next";
import {
    isUserCheckOwner,
    validateCheckType,
    validateObjInfo,
} from "pages/api/common";
import {
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

    const checkBlueprint: CheckBlueprint = req.body.checkBlueprint;

    // validate that you own the check
    if (
        !(await isUserCheckOwner(
            redisClient,
            res,
            userId,
            checkBlueprint.objInfo.id,
        ))
    ) {
        return;
    }

    if (checkBlueprint.isEnabled) {
        // validate that it's legit before we make it enabled
        const validationErr = validateCheckBlueprint(checkBlueprint);
        if (validationErr !== "") {
            sendBadRequest(res, validationErr);
            return;
        }
    }

    const positiveExamples = checkBlueprint.positiveExamples;
    for (const example of positiveExamples) {
        if (checkBlueprint.checkType !== CheckType.rephrase) {
            example.editedText = ""; // clear, so users can't pass in bad data
        }
    }

    await redisClient.set(
        `checks/${checkBlueprint.objInfo.id}`,
        JSON.stringify(checkBlueprint), // TODO: compress this
    );

    return204Status(res);
}

const validateCheckBlueprint = (checkBlueprint: CheckBlueprint): string => {
    const validateObjInfoErr = validateObjInfo(checkBlueprint.objInfo);
    if (validateObjInfoErr !== "") {
        return validateObjInfoErr;
    }

    if (checkBlueprint.instruction === "") {
        return "Check instruction cannot be empty";
    } else if (checkBlueprint.positiveExamples.length === 0) {
        return "Check must have at least one positive example";
    }
    const validateCheckTypeErr = validateCheckType(checkBlueprint.checkType);
    if (validateCheckTypeErr !== "") {
        return validateCheckTypeErr;
    }

    return validatePositiveExamples(checkBlueprint);
};

const validatePositiveExamples = (checkBlueprint: CheckBlueprint) => {
    for (const example of checkBlueprint.positiveExamples) {
        if (example.originalText === "") {
            return "Positive example original text cannot be empty";
        }
    }
    return "";
};
