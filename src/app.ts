import fs from "node:fs";
import chalk from "chalk";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { CommandLineUI } from "./cli/CommandLine.js";
import { displayEndScreen } from "./components/EndScreen.js";
import { displayMainMenuList } from "./components/MainMenu.js";
import checkIfEnvFileIsPresent from "./logic/checkIfEnvFileIsPresent.js";

// __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENV_FILE_PATH = `${__dirname}/../config.env`;

// Check if env files is present
if (checkIfEnvFileIsPresent()) {
    CommandLineUI.success("Found config.env file");
} else {
    CommandLineUI.error("Could not find config.env file");
    if (
        await CommandLineUI.confirm("Do you want to create a config.env file?")
    ) {
        // * Ask for username and password
        const username = await CommandLineUI.textInputLooped(
            "Enter your Instagram Username: ",
        );
        const password = await CommandLineUI.passwordInputLooped(
            "Enter your Instagram Password: ",
        );
        const ENV_FILE_CONTENT = `INSTAGRAM_USERNAME="${username}"\nINSTAGRAM_PASSWORD="${password}"`;

        CommandLineUI.info("Creating config.env file");
        fs.writeFileSync(ENV_FILE_PATH, ENV_FILE_CONTENT);
        dotenv.config({ path: ENV_FILE_PATH });
        CommandLineUI.success("Successfully config.env file");
    } else {
        CommandLineUI.error(
            `Exiting application now as no config.env file was found. Goto ${chalk.underline(
                "https://github.com/Muhammed-Rajab/ig.bot",
            )} to know more.`,
        );
        process.exit(1);
    }
}

// Loading Environment Variables
dotenv.config({ path: ENV_FILE_PATH });

// User credentials from Environment Variables
const USERNAME: string | undefined = process.env.INSTAGRAM_USERNAME;
const PASSWORD: string | undefined = process.env.INSTAGRAM_PASSWORD;

// Check if username and password is present in environment variables
if (!(USERNAME && PASSWORD)) {
    CommandLineUI.error(
        "Username and Password is not present in environment variables. Please check the config.env file.",
    );
    process.exit(1);
}

async function main(): Promise<void> {
    // Clears the command line before running the application
    CommandLineUI.clear();

    let appIsRunning: boolean = true;

    while (appIsRunning) {
        // Display banner
        CommandLineUI.displayBanner();

        // Displays Main Menu
        appIsRunning = await displayMainMenuList();

        // If appIsRunning is false after displaying main menu, that means user has chosen to close the application
        if (!appIsRunning) {
            // if user exited the app, then display the end screen and break the loop
            displayEndScreen();
            break;
        }

        // Ask if the user want to continue using the app
        appIsRunning = await CommandLineUI.confirm(
            "Do you want to continue to Main Menu📃?",
        );

        // Clear the screen
        CommandLineUI.clear();

        // if user exited the app, then display the end screen
        if (!appIsRunning) displayEndScreen();
    }
}

await main();
