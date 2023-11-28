import { Check } from "@components/create-checker/Check";
import * as fs from "fs";

export class Checker {
    name: string;
    checks: Check[]; // Type of checks can be specified more precisely depending on the structure of the checks

    constructor(checkerPath: string) {
        this.checks = [];
        const checkerData = JSON.parse(fs.readFileSync(checkerPath, "utf-8"));
        this.name = checkerData["name"];
        for (const check of checkerData["checks"]) {
            // Assuming you want to add these checks to the checks array
            this.checks.push(check);
        }
    }
}
