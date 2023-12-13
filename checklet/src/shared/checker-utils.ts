import { Checker } from "@api/checker";
import { CheckDescObj } from "@components/create-checker/CheckerTypes";

// this file needs to be in this directory since it's used by the client and the server.
// if we place it with the other functions, the client will import server dependencies (that it cannot get)
export const getCheckDescForCheckIds = (
    checker: Checker,
    uniqueCheckIds: Set<string>,
): CheckDescObj => {
    const checkDescObj: CheckDescObj = {};

    for (const checkId of uniqueCheckIds) {
        const checkBlueprint = checker.checks.get(checkId)?.blueprint;
        if (!checkBlueprint) {
            console.error(
                "[check-doc] cannot find checkBlueprint for checkId",
                checkId,
            );
            continue;
        }
        checkDescObj[checkId] = {
            objInfo: checkBlueprint.objInfo,
            checkType: checkBlueprint.checkType,
            category: checkBlueprint.category,
            positiveExamples: checkBlueprint.positiveExamples,
        };
    }
    return checkDescObj;
};
