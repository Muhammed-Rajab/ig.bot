import chalk from "chalk";
import { IgBot } from "../core/IgBot.js";
import { CommandLineUI, UserInputAsListOptions } from "../cli/CommandLine.js";
import { sign } from "crypto";

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

// Bot options
async function followUser(bot: IgBot, loggingEnabled: boolean) {
    try {
        CommandLineUI.log("");

        let userToFollow: string;

        do {
            userToFollow = (
                await CommandLineUI.textInput("Enter the username to follow: ")
            ).trim();
        } while (userToFollow === undefined || userToFollow === "");

        // Display bot status and follow the user
        if (loggingEnabled) CommandLineUI.displayLoggingStartMessage();
        CommandLineUI.info(`Attempting to follow @${userToFollow}`, "\n", "\n");
        await bot.followUser(userToFollow);
        CommandLineUI.success(
            `Successfully followed @${userToFollow}`,
            "\n",
            "\n",
        );
        if (loggingEnabled) CommandLineUI.displayLoggingEndMessage();
    } catch (err) {
        throw new Error(
            `Invalid username: Provide the username of an existing user.`,
        );
    }
}

async function unfollowUser(bot: IgBot, loggingEnabled: boolean) {
    try {
        CommandLineUI.log("");

        let userToUnFollow: string;

        do {
            userToUnFollow = (
                await CommandLineUI.textInput(
                    "Enter the username to unfollow: ",
                )
            ).trim();
        } while (userToUnFollow === undefined || userToUnFollow === "");

        // Display bot status and unfollow the user
        if (loggingEnabled) CommandLineUI.displayLoggingStartMessage();
        CommandLineUI.info(
            `Attempting to unfollow @${userToUnFollow}`,
            "\n",
            "\n",
        );
        await bot.unfollowUser(userToUnFollow);
        CommandLineUI.success(
            `Successfully unfollowed @${userToUnFollow}`,
            "\n",
            "\n",
        );
        if (loggingEnabled) CommandLineUI.displayLoggingEndMessage();
    } catch (e) {
        throw new Error(
            `Invalid username: Provide the username of an existing user.`,
        );
    }
}

async function unfollowUsersWhoDontFollowBack(
    bot: IgBot,
    loggingEnabled: boolean,
) {
    // Ask whether the user want to unfollow users who don't follow back as it potentially takes a long time and can get the user banned
    CommandLineUI.warn(
        ` This action can take a long time and can get the user banned. \nIf your ${chalk.red(
            "followers:following",
        )} ratio is high, you shouldn't use this action.`,
        "\n",
        "\n",
    );
    const consent = await CommandLineUI.confirm("Do you want to continue?");
    if (!consent) {
        CommandLineUI.info("Aborting action.");
        return;
    }

    // Display bot status and unfollow the users who don't follow back
    if (loggingEnabled) CommandLineUI.displayLoggingStartMessage();
    CommandLineUI.info(
        `Attempting to unfollow users who don't follow back`,
        "\n",
        "\n",
    );

    // Gets the list of users who don't follow back
    const usersWhoDontFollowBackList = await bot.getUsersWhoDoNotFollowBack();

    // Ask the user whether they want to print the list of users who don't follow back
    CommandLineUI.log("");
    if (
        await CommandLineUI.confirm(
            "Do you want to display the list of users who don't follow you back?",
        )
    ) {
        CommandLineUI.info(
            `Here's the list of users who don't follow you back ⤵️`,
            "\n",
            "\n",
        );
        CommandLineUI.error(
            usersWhoDontFollowBackList.join("  "),
            "",
            "\n",
            false,
        );
    }

    CommandLineUI.success(
        `Successfully unfollowed users who don't follow back`,
        "\n",
        "\n",
    );
    if (loggingEnabled) CommandLineUI.displayLoggingEndMessage();
}

export async function displayBotMenu(
    bot: IgBot,
    logger: { getLogger(): any; allowLogging: boolean },
): Promise<void> {
    const botMenuInput: botMenuListChoices =
        await CommandLineUI.getUserInputFromList(botMenuListOptions);

    switch (botMenuInput) {
        case botMenuListChoices.FOLLOW_USER: // Done
            await followUser(bot, logger.allowLogging);
            break;
        case botMenuListChoices.FOLLOW_USERS_FROM_FILE:
            break;
        case botMenuListChoices.UNFOLLOW_USER: // Done
            await unfollowUser(bot, logger.allowLogging);
            break;
        case botMenuListChoices.UNFOLLOW_USERS_FROM_FILE:
            break;
        case botMenuListChoices.UNFOLLOW_USERS_WHO_DONT_FOLLOW_BACK: // Done
            await unfollowUsersWhoDontFollowBack(bot, logger.allowLogging);
            break;
        case botMenuListChoices.GET_FOLLOWING_LIST:
            break;
        case botMenuListChoices.GET_FOLLOWERS_LIST:
            break;
        case botMenuListChoices.GET_LIST_OF_USERS_WHO_DONT_FOLLOW_BACK:
            break;
    }
}
