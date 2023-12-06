import { CheckerId } from "@api/checker";
import {
    CheckBlueprint,
    CheckType,
    CheckerBlueprint,
    CheckerStorefront,
    ObjInfo,
    validCheckTypes,
} from "@components/create-checker/CheckerTypes";
import { isLegitId } from "@utils/strings";
import { NextApiResponse } from "next";
import { RedisClient, sendBadRequest } from "pages/api/commonNetworking";

export const isUserCheckerOwner = async (
    redisClient: RedisClient,
    res: NextApiResponse,
    userId: string,
    checkerId: CheckerId,
): Promise<boolean> => {
    if (
        !(await redisClient.sIsMember(`users/${userId}/checkerIds`, checkerId))
    ) {
        sendBadRequest(
            res,
            "You did not create this checker. You cannot read/edit it",
        );
        return false;
    }
    return true;
};

export const isUserCheckOwner = async (
    redisClient: RedisClient,
    res: NextApiResponse,
    userId: string,
    checkId: CheckerId,
): Promise<boolean> => {
    if (!(await redisClient.sIsMember(`users/${userId}/checkIds`, checkId))) {
        sendBadRequest(
            res,
            "You did not create this check. You cannot edit it",
        );
        return false;
    }
    return true;
};

export const checkerBlueprintToCheckerStorefront = (
    blueprint: CheckerBlueprint,
): CheckerStorefront => {
    return {
        objInfo: blueprint.objInfo,
    };
};

export const validateObjInfo = (objInfo: ObjInfo): string => {
    if (objInfo.name === "") {
        return "Checker description cannot be empty";
    } else if (objInfo.desc === "") {
        return "Checker description cannot be empty";
    } else if (!isLegitId(objInfo.id)) {
        return "Checker id is not legit";
    }

    // TODO: validate that the user exists
    return "";
};

export const validateCheckType = (checkType: CheckType): string => {
    if (!validCheckTypes.includes(checkType)) {
        return `Check type must be one of [${validCheckTypes.join(
            ", ",
        )}]. Got ${checkType}`;
    }
    return "";
};

export const validateChecker = async (
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

// this function assumes that the validation logic used to see if the user is the owner of the checker has passed
export const getCheckBlueprints = async (
    redisClient: RedisClient,
    checkerBlueprint: CheckerBlueprint,
    onlyGetIsEnabled: boolean,
): Promise<CheckBlueprint[]> => {
    const checkStatuses = Object.entries(checkerBlueprint.checkStatuses);
    const filteredStatuses = onlyGetIsEnabled
        ? checkStatuses.filter(([_, checkStatus]) => checkStatus.isEnabled)
        : checkStatuses;
    const enabledCheckIds = filteredStatuses.map(
        ([checkId, _checkStatus]) => checkId,
    );

    const checkKeys = enabledCheckIds.map((checkId) => `checks/${checkId}`);
    const rawCheckBlueprints: (string | null)[] = await redisClient.mGet(
        checkKeys,
    );
    const checkBlueprints: CheckBlueprint[] = [];
    for (let i = 0; i < checkKeys.length; i++) {
        const rawCheckBlueprint = rawCheckBlueprints[i];
        if (rawCheckBlueprint === null) {
            console.error(`rawCheckBlueprint is null for ${checkKeys[i]}`);
            continue;
        }
        checkBlueprints.push(JSON.parse(rawCheckBlueprint));
    }
    return checkBlueprints;
};
