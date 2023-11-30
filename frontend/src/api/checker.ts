import { Check } from "@api/check";
import { CheckerBlueprint } from "@components/create-checker/CheckerTypes";
import * as fs from "fs";

export type CheckerId = string; // TODO: make this 32 bytes?
export class Checker {
    blueprint: CheckerBlueprint;
    id: string;
    checks: Check[] = [];

    constructor(checkerBlueprint: CheckerBlueprint) {
        this.blueprint = checkerBlueprint;
        this.id = checkerBlueprint.id;

        console.log("this.checks1");
        for (const checkBlueprint of checkerBlueprint.checkBlueprints) {
            const check = new Check(checkBlueprint);
            this.checks.push(check);
        }
        console.log("this.checks2");
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
