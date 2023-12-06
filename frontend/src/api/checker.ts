import { Suggestion } from "@api/ApiTypes";
import { Check } from "@api/check";
import {
    CheckBlueprint,
    CheckId,
    CheckerBlueprint,
} from "@components/create-checker/CheckerTypes";

export type CheckerId = string; // TODO: make this 32 bytes?
export class Checker {
    blueprint: CheckerBlueprint;
    checks: Map<CheckId, Check>;

    constructor(
        checkerBlueprint: CheckerBlueprint,
        checkBlueprints: CheckBlueprint[],
    ) {
        this.blueprint = checkerBlueprint;
        this.checks = new Map<CheckId, Check>();

        for (const checkBlueprint of checkBlueprints) {
            const check = new Check(checkBlueprint);
            this.checks.set(checkBlueprint.objInfo.id, check);
        }
    }

    // static fromFile(checkerPath: string): Checker {
    //     const checkerBlueprint = JSON.parse(
    //         fs.readFileSync(checkerPath, "utf-8"),
    //     );
    //     return new Checker(checkerBlueprint);
    // }

    async checkDoc(doc: string): Promise<Suggestion[]> {
        const results: Suggestion[] = [];
        for (const check of this.checks.values()) {
            // todo: parallelize
            results.push(...(await check.checkDoc(doc)));
        }
        return results;
    }
}
