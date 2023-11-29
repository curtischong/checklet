import { Checker } from "@api/checker";
import { CheckBlueprint } from "@components/create-checker/Check";
import * as fs from "fs";
import * as path from "path";

export class Engine {
    private checkers = new Map<string, Checker>(); // maps checker names -> checkers

    importCheckers(): void {
        const checkersDir = "./checkers/";
        fs.readdirSync(checkersDir).forEach((filename) => {
            if (filename.endsWith(".json")) {
                const checkerPath = path.join(checkersDir, filename);
                const checkerBlueprint = JSON.parse(
                    fs.readFileSync(checkerPath, "utf8"),
                );
                const checker = new Checker(checkerBlueprint);
                this.checkers.set(checkerBlueprint.name, checker);
            }
        });
    }

    checkDoc(doc: string, check: CheckBlueprint): void {
        // TODO: feed prompt to LLM
        // TODO: Implement the method logic
        // check.longDesc;
        console.log(doc); // Ensure 'systemPrompt' is defined or passed as an argument

        // export type Suggestion = {
        //     id: number;
        //     feedbackCategory: string;
        //     feedbackType: FeedbackType;
        //     srcNautObj: string;
        //     replacementText: string;
        //     highlightRanges: Range[];
        //     highlightRangesOnSelect: Range[];
        //     shortDesc: string;
        //     longDesc: string;
        //     srcWord: {
        //         id: number;
        //         text: string;
        //         startChar: number;
        //         endChar: number;
        //     };
        //     color: string;
        //     cardRef: RefObject<HTMLDivElement>;
        // };
    }
}
