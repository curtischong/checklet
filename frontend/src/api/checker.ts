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
        // 1) get all the prompts for all the checks
        const prompts = [];
        for (const check of this.checks.values()) {
            prompts.push(check.getPromptForDoc(doc));
        }

        const results: Suggestion[] = [];
        for (const check of this.checks.values()) {
            // todo: parallelize. but maybe not cause we don't want to spam the api
            // but maybe we should batch calls then in one request
            results.push(...(await check.checkDoc(doc)));
        }
        return results;
    }
}
