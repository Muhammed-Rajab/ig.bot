// Importing modules and libraries
import { logger } from "../utils.js";
import { IgBot } from "../core/IgBot.js";
import { CommandLineUI } from "../cli/CommandLine.js";

// Importin configurations
import InstautoConfig from "../config/InstautoConfig.js";
import PuppeteerConfig from "../config/PuppeteerConfig.js";

export default async function (USERNAME: string, PASSWORD: string) {
    /* Function to provide the user access to the ig.bot interface */

    // Bot instance
    const bot = new IgBot(PuppeteerConfig, {
        ...InstautoConfig,
        logger,
        username: USERNAME,
        password: PASSWORD,
    });
}
