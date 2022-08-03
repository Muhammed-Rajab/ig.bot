import { CommandLineUI, UserInputAsListOptions } from "../cli/CommandLine.js";

// Main menu configuration
enum mainMenuListChoices {
    SETUP_CREDENTIALS,
    BOOTUP_BOT,
    ABOUT_DEV,
    VALIDATE_CREDENTIALS,
}

const mainMenuListOptions: UserInputAsListOptions = {
    title: "Main Menu",
    choices: [
        {
            name: "Setup Credentials 🗝️",
            out: mainMenuListChoices.SETUP_CREDENTIALS,
        },
        {
            name: "Validate Credentials ✅",
            out: mainMenuListChoices.VALIDATE_CREDENTIALS,
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
        case mainMenuListChoices.SETUP_CREDENTIALS:
            console.log("Setup Credentials");
            break;
        case mainMenuListChoices.VALIDATE_CREDENTIALS:
            console.log("Validate the credentials");
            break;
        case mainMenuListChoices.BOOTUP_BOT:
            console.log("Boot up the bot");
            break;
        case mainMenuListChoices.ABOUT_DEV:
            console.log("About the Developer");
            break;
    }
}
export { displayMainMenuList };
