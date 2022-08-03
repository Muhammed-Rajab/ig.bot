import { IgBot } from "../core/IgBot.js";
import { CommandLineUI, UserInputAsListOptions } from "../cli/CommandLine.js";

// Bot menu configuration
enum botMenuListChoices {
    UNFOLLOW_USER,
    UNFOLLOW_USERS_FROM_FILE,
    UNFOLLOW_USERS_WHO_DONT_FOLLOW_BACK,

    FOLLOW_USER,
    FOLLOW_USERS_FROM_FILE,

    GET_FOLLOWING_LIST,
    GET_FOLLOWERS_LIST,
    GET_LIST_OF_USERS_WHO_DONT_FOLLOW_BACK,
}

const botMenuListOptions: UserInputAsListOptions = {
    title: "Bot Menu",
    choices: [
        {
            name: "Follow A User",
            out: botMenuListChoices.FOLLOW_USER,
        },
        {
            name: "Follow Users From A File",
            out: botMenuListChoices.FOLLOW_USERS_FROM_FILE,
        },
        {
            name: "Unfollow A User",
            out: botMenuListChoices.UNFOLLOW_USER,
        },
        {
            name: "Unfollow Users From A File",
            out: botMenuListChoices.UNFOLLOW_USERS_FROM_FILE,
        },
        {
            name: "Unfollow Users Who Don't Follow Back",
            out: botMenuListChoices.UNFOLLOW_USERS_WHO_DONT_FOLLOW_BACK,
        },
        {
            name: "Get the list of following users",
            out: botMenuListChoices.GET_FOLLOWING_LIST,
        },
        {
            name: "Get the list of followers",
            out: botMenuListChoices.GET_FOLLOWERS_LIST,
        },
        {
            name: "Get the list of users who don't follow back",
            out: botMenuListChoices.GET_LIST_OF_USERS_WHO_DONT_FOLLOW_BACK,
        },
    ],
};

export async function displayBotMenu(bot: IgBot): Promise<void> {
    const botMenuInput: botMenuListChoices =
        await CommandLineUI.getUserInputFromList(botMenuListOptions);
}
