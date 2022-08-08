import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log(__dirname);

export default function checkIfEnvFileIsPresent() {
    const envFilePath = `${__dirname}/../../config.env`;
    return fs.existsSync(envFilePath);
}
