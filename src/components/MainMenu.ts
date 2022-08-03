import bootupBot from "../logic/bootupBot.js";
import aboutDeveloper from "../logic/aboutDeveloper.js";
import setupUserCredentials from "../logic/setupUserCredentials.js";
import validateUserCredentials from "../logic/validateUserCredentials.js";
import { CommandLineUI, UserInputAsListOptions } from "../cli/CommandLine.js";

// Main menu configuration
enum mainMenuListChoices {
    SETUP_USER_CREDENTIALS,
    BOOTUP_BOT,
    ABOUT_DEV,
    VALIDATE_USER_CREDENTIALS,
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
            name: "Boot Up ig.bot🚀",
            out: mainMenuListChoices.BOOTUP_BOT,
        },
        {
            name: "About The Developer",
            out: mainMenuListChoices.ABOUT_DEV,
        },
    ],
};

async function displayMainMenuList(): Promise<void> {
    // Display main menu and wait fort input
    const mainMenuInput: mainMenuListChoices =
        await CommandLineUI.getUserInputFromList(mainMenuListOptions);

    // Calling other methods with respect to user input
    switch (mainMenuInput) {
        case mainMenuListChoices.SETUP_USER_CREDENTIALS:
            await setupUserCredentials();
            break;
        case mainMenuListChoices.VALIDATE_USER_CREDENTIALS:
            await validateUserCredentials();
            break;
        case mainMenuListChoices.BOOTUP_BOT:
            await bootupBot();
            break;
        case mainMenuListChoices.ABOUT_DEV:
            await aboutDeveloper();
            break;
    }
}
export { displayMainMenuList };
