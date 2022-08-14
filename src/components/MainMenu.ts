import bootupBot from "../logic/bootupBot.js";
import aboutDeveloper from "../logic/aboutDeveloper.js";
import setupUserCredentials from "../logic/setupUserCredentials.js";
import validateUserCredentials from "../logic/validateUserCredentials.js";
import { CommandLineUI, UserInputAsListOptions } from "../cli/CommandLine.js";
import clearCookies from "../logic/clearCookies.js";

// User credentials from Environment Variables
const USERNAME: string | undefined = process.env.INSTAGRAM_USERNAME;
const PASSWORD: string | undefined = process.env.INSTAGRAM_PASSWORD;

// Main menu configuration
enum mainMenuListChoices {
    SETUP_USER_CREDENTIALS,
    BOOTUP_BOT,
    ABOUT_DEV,
    CLOSE_THE_APPLICATION,
    VALIDATE_USER_CREDENTIALS,
    CLEAR_COOKIES,
}

const mainMenuListOptions: UserInputAsListOptions = {
    title: "Main Menu",
    choices: [
        {
            name: "Setup Credentials 🗝️",
            out: mainMenuListChoices.SETUP_USER_CREDENTIALS,
        },
        {
            name: "Validate User Credentials ✅",
            out: mainMenuListChoices.VALIDATE_USER_CREDENTIALS,
        },
        {
            name: "Clear The Cookies 🍪",
            out: mainMenuListChoices.CLEAR_COOKIES,
        },
        {
            name: "Boot Up ig.bot🚀",
            out: mainMenuListChoices.BOOTUP_BOT,
        },
        {
            name: "About The Developer 🤓",
            out: mainMenuListChoices.ABOUT_DEV,
        },
        {
            name: "Close The Application ❌",
            out: mainMenuListChoices.CLOSE_THE_APPLICATION,
        },
    ],
};

async function displayMainMenuList(): Promise<boolean> {
    // Display main menu and wait fort input
    const mainMenuInput: mainMenuListChoices =
        await CommandLineUI.getUserInputFromList(mainMenuListOptions);

    // Calling other methods with respect to user input
    switch (mainMenuInput) {
        case mainMenuListChoices.SETUP_USER_CREDENTIALS:
            await setupUserCredentials();
            break;
        case mainMenuListChoices.VALIDATE_USER_CREDENTIALS:
            await validateUserCredentials(USERNAME, PASSWORD);
            break;
        case mainMenuListChoices.BOOTUP_BOT:
            await bootupBot(USERNAME, PASSWORD);
            break;
        case mainMenuListChoices.CLEAR_COOKIES:
            await clearCookies();
            break;
        case mainMenuListChoices.ABOUT_DEV:
            await aboutDeveloper();
            break;
        case mainMenuListChoices.CLOSE_THE_APPLICATION:
            return false;
            break;
    }

    return true;
}
export { displayMainMenuList };
