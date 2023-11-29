import { Check } from "@api/check";
import { CheckerBlueprint } from "@components/create-checker/CheckerCreator";
import * as fs from "fs";

export class Checker {
    blueprint: CheckerBlueprint;
    id: string;
    checks: Check[] = [];

    constructor(checkerBlueprint: CheckerBlueprint) {
        this.blueprint = checkerBlueprint;
        this.id = checkerBlueprint.id;

        for (const checkBlueprint of checkerBlueprint.checkBlueprints) {
            const check = new Check(checkBlueprint);
            this.checks.push(check);
        }
    }

    static fromFile(checkerPath: string): Checker {
        const checkerBlueprint = JSON.parse(
            fs.readFileSync(checkerPath, "utf-8"),
        );
        return new Checker(checkerBlueprint);
    }

    checkDoc(doc: string): void {
        const results = [];
        for (const check of this.checks) {
            results.push(check.checkDoc(doc));
        }
        // return "dummy";
    }
}
