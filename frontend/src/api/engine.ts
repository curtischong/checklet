import { Checker } from "@api/checker";
import { CheckBlueprint } from "@components/create-checker/Check";
import * as fs from "fs";
import * as path from "path";

export class Engine {
    private checkers = new Map<string, Checker>(); // maps checker names to checkers

    importCheckers(): void {
        const checkersDir = "./checkers/";
        fs.readdirSync(checkersDir).forEach((filename) => {
            if (filename.endsWith(".json")) {
                const checkerPath = path.join(checkersDir, filename);
                const checker = new Checker(checkerPath);
                this.checkers.set(checker.name, checker);
            }
        });
    }

    checkDoc(document: string, check: CheckBlueprint): void {
        // TODO: feed prompt to LLM
        // TODO: Implement the method logic
        check.longDesc;
        console.log(systemPrompt); // Ensure 'systemPrompt' is defined or passed as an argument
    }
}
