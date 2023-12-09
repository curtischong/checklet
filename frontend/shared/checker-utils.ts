import { Checker } from "@api/checker";
import { CheckDescObj } from "@components/create-checker/CheckerTypes";

export const getCheckDescForCheckIds = (
    checker: Checker,
    uniqueCheckIds: Set<string>,
): CheckDescObj => {
    const checkDescObj: CheckDescObj = {};

    for (const checkId of uniqueCheckIds) {
        console.log("checkId", checkId);
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
