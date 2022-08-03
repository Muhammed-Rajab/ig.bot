import path from "path";
import dotenv from "dotenv";
import { logger } from "./utils.js";
import { fileURLToPath } from "url";
import { IgBot } from "./core/IgBot.js";
import { CommandLineUI } from "./cli/CommandLine.js";
import { displayMainMenuList } from "./components/MainMenu.js";

// Importin configurations
import InstautoConfig from "./config/InstautoConfig.js";
import PuppeteerConfig from "./config/PuppeteerConfig.js";

// Loading Environment Variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: `${__dirname}/../config.env` });

// User credentials from Environment Variables
const USERNAME: string | undefined = process.env.INSTAGRAM_USERNAME;
const PASSWORD: string | undefined = process.env.INSTAGRAM_PASSWORD;

// Bot instance
const bot = new IgBot(PuppeteerConfig, {
    ...InstautoConfig,
    logger,
    username: USERNAME,
    password: PASSWORD,
});

async function main(): Promise<void> {
    let appIsRunning: boolean = true;

    while (appIsRunning) {
        // Display banner
        CommandLineUI.displayBanner();

        // Displays Main Menu
        await displayMainMenuList();

        // Ask if the user want to continue using the app
        appIsRunning = await CommandLineUI.confirm("Do you want to continue?");
        console.log(`The user wants the app to run? ${appIsRunning}`);

        // Clears the command line
        CommandLineUI.clear();

        // if user exited the app, then display thank you for using message
        if (!appIsRunning)
            console.log(
                `Thank you for using ig.bot💖\nCheckout other apps in https://github.com/Muhammed-Rajab?tab=repositories`,
            );
    }
}

await main();
