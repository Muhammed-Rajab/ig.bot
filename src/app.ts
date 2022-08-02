import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { IgBot } from "./core/IgBot.js";
import { logger } from "./utils.js";

// Importin configurations
import InstautoConfig from "./config/InstautoConfig.js";
import PuppeteerConfig from "./config/PuppeteerConfig.js";
import { CommandLineUI } from "./cli/CommandLine.js";

// Loading Environment Variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: `${__dirname}/../config.env` });

// Bot instance
const bot = new IgBot(PuppeteerConfig, {
    ...InstautoConfig,
    logger,
    username: process.env.INSTAGRAM_USERNAME,
    password: process.env.INSTAGRAM_PASSWORD,
});

CommandLineUI.displayBanner();
