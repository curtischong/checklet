import { FeedbackResponse, Suggestion } from "@api/ApiTypes";
import { Check } from "@api/check";
import {
    CheckId,
    CheckerBlueprint,
} from "@components/create-checker/CheckerTypes";
import * as fs from "fs";

export type CheckerId = string; // TODO: make this 32 bytes?
export class Checker {
    blueprint: CheckerBlueprint;
    id: string;
    checks: Map<CheckId, Check>;

    constructor(checkerBlueprint: CheckerBlueprint) {
        this.blueprint = checkerBlueprint;
        this.id = checkerBlueprint.id;
        this.checks = new Map<CheckId, Check>();

        for (const checkBlueprint of checkerBlueprint.checkBlueprints) {
            const check = new Check(checkBlueprint);
            this.checks.set(checkBlueprint.checkId, check);
        }
    }

    static fromFile(checkerPath: string): Checker {
        const checkerBlueprint = JSON.parse(
            fs.readFileSync(checkerPath, "utf-8"),
        );
        return new Checker(checkerBlueprint);
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
