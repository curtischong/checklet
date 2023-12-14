import Log from "@/api/logger";
import * as crypto from "crypto";
import * as fs from "fs";

export class SimpleCache {
    filePath: string;
    cache: Record<string, string>;

    constructor(cacheDir: string, filePath: string) {
        fs.mkdirSync(cacheDir, { recursive: true });

        this.filePath = cacheDir + filePath;
        this.cache = {};

        // Load existing data from the file if it exists
        this.loadFromFile();
    }

    loadFromFile(): void {
        // Check if file exists
        if (fs.existsSync(this.filePath)) {
            try {
                const fileContent = fs.readFileSync(this.filePath, "utf8");
                this.cache = JSON.parse(fileContent);
            } catch (error) {
                Log.error(
                    `Error reading from cache file. filepath=${this.filePath}, err=${error}`,
                );
            }
        }
    }

    saveToFile(): void {
        try {
            const data = JSON.stringify(this.cache, null, 2);
            fs.writeFileSync(this.filePath, data, "utf8");
        } catch (error) {
            Log.error("Error writing to cache file:", error);
        }
    }

    getKey(messages: any): string {
        return crypto
            .createHash("sha256")
            .update(JSON.stringify(messages, null, 0))
            .digest("hex");
    }

    set(rawKey: any, value: any): void {
        this.cache[this.getKey(rawKey)] = JSON.stringify(value);
        this.saveToFile();
    }

    get(rawKey: any): any {
        const key = this.getKey(rawKey);
        if (!(key in this.cache)) {
            return undefined;
        }
        const value = this.cache[key];
        try {
            return JSON.parse(value);
        } catch (error) {
            Log.error("Error parsing cache value", error);
            return undefined;
        }
    }

    remove(rawKey: any): void {
        delete this.cache[this.getKey(rawKey)];
        this.saveToFile();
    }

    clear(): void {
        this.cache = {};
        this.saveToFile();
    }
}
