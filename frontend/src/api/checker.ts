import { Suggestion } from "@api/ApiTypes";
import { Check } from "@api/check";
import {
    CheckBlueprint,
    CheckId,
} from "@components/create-checker/CheckerTypes";

export type CheckerId = string; // TODO: make this 32 bytes?
export class Checker {
    checks: Map<CheckId, Check>;

    constructor(
        checkBlueprints: CheckBlueprint[],
        private modelName: string,
        cache: any | undefined,
    ) {
        this.checks = new Map<CheckId, Check>();

        for (const checkBlueprint of checkBlueprints) {
            const check = new Check(checkBlueprint, this.modelName, cache);
            this.checks.set(checkBlueprint.objInfo.id, check);
        }
    }

    async checkDoc(doc: string): Promise<Suggestion[]> {
        const results: Suggestion[] = [];
        for (const check of this.checks.values()) {
            // todo: parallelize
            results.push(...(await check.checkDoc(doc)));
        }
        return results;
    }
}
