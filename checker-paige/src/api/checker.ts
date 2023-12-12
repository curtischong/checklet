import { Suggestion } from "@api/ApiTypes";
import { Check } from "@api/check";
import {
    CheckBlueprint,
    CheckId,
} from "@components/create-checker/CheckerTypes";

export type CheckerId = string;
export class Checker {
    checks: Map<CheckId, Check>;

    constructor(
        checkBlueprints: CheckBlueprint[],
        private modelName: string,
        cache: any | undefined,
        apiKey: string | undefined,
    ) {
        this.checks = new Map<CheckId, Check>();

        for (const checkBlueprint of checkBlueprints) {
            const check = new Check(
                checkBlueprint,
                this.modelName,
                cache,
                apiKey,
            );
            this.checks.set(checkBlueprint.objInfo.id, check);
        }
    }

    async checkDoc(doc: string): Promise<Suggestion[]> {
        const results = await Promise.all(
            Array.from(this.checks.values()).map((check) =>
                check.checkDoc(doc),
            ),
        );
        return ([] as Suggestion[]).concat(...results);
    }
}
