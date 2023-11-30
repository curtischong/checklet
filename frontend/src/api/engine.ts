import { Checker } from "@api/checker";
import { CheckerBlueprint } from "@components/create-checker/CheckerTypes";
import * as fs from "fs";
import * as path from "path";

export class Engine {
    private checkers = new Map<string, Checker>(); // maps checker.id -> checkers

    importCheckers(): void {
        const checkersDir = "./checkers/";
        fs.readdirSync(checkersDir).forEach((filename) => {
            if (filename.endsWith(".json")) {
                const checkerPath = path.join(checkersDir, filename);
                const checkerBlueprint: CheckerBlueprint = JSON.parse(
                    fs.readFileSync(checkerPath, "utf8"),
                );
                const checker = new Checker(checkerBlueprint);
                this.checkers.set(checkerBlueprint.id, checker);
            }
        });
    }

    checkDoc(doc: string, checkerId: string): void {
        const checker = this.checkers.get(checkerId);
        if (!checker) {
            throw new Error(`Checker with id ${checkerId} not found`);
        }
        checker.checkDoc(doc);
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
