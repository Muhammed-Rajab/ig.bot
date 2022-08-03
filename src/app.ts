import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { CommandLineUI } from "./cli/CommandLine.js";
import { displayEndScreen } from "./components/EndScreen.js";
import { displayMainMenuList } from "./components/MainMenu.js";

// Loading Environment Variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: `${__dirname}/../config.env` });

// User credentials from Environment Variables
const USERNAME: string | undefined = process.env.INSTAGRAM_USERNAME;
const PASSWORD: string | undefined = process.env.INSTAGRAM_PASSWORD;

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

        // if user exited the app, then display the end screen
        if (!appIsRunning) displayEndScreen();
    }
}

await main();
