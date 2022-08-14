import fs from "node:fs";
import path from "path";
import { fileURLToPath } from "url";
import { CommandLineUI } from "../cli/CommandLine.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COOKIE_PATH = path.join(__dirname, "../../bot_data/cookies.json");

export default async function clearCookies() {
    if (
        await CommandLineUI.confirm(
            "Are you sure you want to clear the cookies?",
        )
    ) {
        CommandLineUI.info("Looking for cookies in bot_data folder 🔍");
        if (fs.existsSync(COOKIE_PATH)) {
            CommandLineUI.info("Cookies found, deleting...❌");
            fs.unlinkSync(COOKIE_PATH);
            CommandLineUI.success("Cookies deleted successfully ✅");
        } else {
            CommandLineUI.error("Cookies not found, nothing to delete ❌");
        }
    }
}
