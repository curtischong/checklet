import { Check } from "@api/check";
import { CheckerBlueprint } from "@components/create-checker/CheckerCreator";
import * as fs from "fs";

export class Checker {
    blueprint: CheckerBlueprint;
    checks: Check[] = []; // Type of checks can be specified more precisely depending on the structure of the checks

    constructor(checkerBlueprint: CheckerBlueprint) {
        this.blueprint = checkerBlueprint;

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
}
