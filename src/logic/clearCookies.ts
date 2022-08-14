import fs from "node:fs";
import settings from "../config/Settings.js";
import { CommandLineUI } from "../cli/CommandLine.js";

export default async function clearCookies() {
    if (
        await CommandLineUI.confirm(
            "Are you sure you want to clear the cookies?",
        )
    ) {
        CommandLineUI.info("Looking for cookies in bot_data folder 🔍");
        if (fs.existsSync(settings.COOKIES_PATH)) {
            CommandLineUI.info("Cookies found, deleting...❌");
            fs.unlinkSync(settings.COOKIES_PATH);
            CommandLineUI.success("Cookies deleted successfully ✅");
        } else {
            CommandLineUI.error("Cookies not found, nothing to delete ❌");
        }
    }
}
