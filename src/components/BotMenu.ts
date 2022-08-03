import { IgBot } from "../core/IgBot.js";
import { CommandLineUI, UserInputAsListOptions } from "../cli/CommandLine.js";

// Bot menu configuration
enum botMenuListChoices {
    SETUP_USER_CREDENTIALS,
    BOOTUP_BOT,
    ABOUT_DEV,
    CLOSE_THE_APPLICATION,
    VALIDATE_USER_CREDENTIALS,
}

const botMenuListOptions: UserInputAsListOptions = {
    title: "Bot Menu",
    choices: [
        {
            name: "Bot menu 1",
            out: botMenuListChoices.SETUP_USER_CREDENTIALS,
        },
        {
            name: "Bot menu 2",
            out: botMenuListChoices.VALIDATE_USER_CREDENTIALS,
        },
        {
            name: "Bot menu 3",
            out: botMenuListChoices.BOOTUP_BOT,
        },
        {
            name: "Bot menu 4",
            out: botMenuListChoices.ABOUT_DEV,
        },
        {
            name: "Bot menu 5",
            out: botMenuListChoices.CLOSE_THE_APPLICATION,
        },
    ],
};

export async function displayBotMenu(bot: IgBot): Promise<void> {
    const botMenuInput: botMenuListChoices =
        await CommandLineUI.getUserInputFromList(botMenuListOptions);
}
