import * as fs from "fs";
import * as crypto from "crypto";

export class SimpleCache {
    filePath: string;
    cache: Record<string, string>;
    constructor(filePath: string) {
        this.filePath = filePath;
        this.cache = {};

        // Load existing data from the file if it exists
        this.loadFromFile();
    }

    loadFromFile() {
        // Check if file exists
        if (fs.existsSync(this.filePath)) {
            try {
                const fileContent = fs.readFileSync(this.filePath, "utf8");
                this.cache = JSON.parse(fileContent);
            } catch (error) {
                console.error("Error reading from cache file:", error);
            }
        }
    }

    saveToFile() {
        try {
            const data = JSON.stringify(this.cache, null, 2);
            fs.writeFileSync(this.filePath, data, "utf8");
        } catch (error) {
            console.error("Error writing to cache file:", error);
        }
    }

    getKey(messages: any): string {
        return crypto
            .createHash("sha256")
            .update(JSON.stringify(messages, null, 0))
            .digest("hex");
    }

    set(rawKey: any, value: any) {
        this.cache[this.getKey(rawKey)] = JSON.stringify(value);
        this.saveToFile();
    }

    get(rawKey: any) {
        const key = this.getKey(rawKey);
        if (key in this.cache) {
            return undefined;
        }
        return JSON.parse(this.cache[key]);
    }

    remove(rawKey: any) {
        delete this.cache[this.getKey(rawKey)];
        this.saveToFile();
    }

    clear() {
        this.cache = {};
        this.saveToFile();
    }
}

module.exports = SimpleCache;
