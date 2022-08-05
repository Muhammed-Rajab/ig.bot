import fs from "fs";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";
import { IgBot, usersWhoDontWantToFollowBack } from "../core/IgBot.js";
import { CommandLineUI, UserInputAsListOptions } from "../cli/CommandLine.js";
import { timeStamp } from "console";

// Loading Environment Variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
        // {
        //     name: "Follow Users From A File",
        //     out: botMenuListChoices.FOLLOW_USERS_FROM_FILE,
        // },
        {
            name: "Unfollow A User",
            out: botMenuListChoices.UNFOLLOW_USER,
        },
        // {
        //     name: "Unfollow Users From A File",
        //     out: botMenuListChoices.UNFOLLOW_USERS_FROM_FILE,
        // },
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

async function getUserWhoDontFollowBack(
    bot: IgBot,
    loggingEnabled: boolean,
): Promise<usersWhoDontWantToFollowBack | void> {
    // Ask whether the user want to unfollow users who don't follow back as it potentially takes a long time and can get the user banned
    CommandLineUI.warn(
        ` This action can take a long time and can get the your account banned. \nIf your ${chalk.red(
            "followers:following",
        )} ratio is high, you shouldn't use this action.`,
        "\n",
        "\n",
    );

    if (!(await CommandLineUI.confirm("Do you want to continue?"))) {
        return CommandLineUI.info("Aborting action.");
    }

    // Display bot status and unfollow the users who don't follow back
    if (loggingEnabled) CommandLineUI.displayLoggingStartMessage();
    CommandLineUI.info(
        `Attempting to get list of users who don't follow back`,
        "\n",
        "\n",
    );

    // Gets the list of users who don't follow back
    const {
        followers_count: followersCount,
        following_count: followingCount,
        users_who_dont_follow_back_count: usersWhoDontFollowBackCount,
        data: usersWhoDontFollowBackList,
    } = await bot.getUsersWhoDoNotFollowBack();

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
        CommandLineUI.success(
            `# of followers: ${followersCount}`,
            "\n",
            "",
            false,
        );
        CommandLineUI.success(
            `# of followings: ${followingCount}`,
            "\n",
            "",
            false,
        );
        CommandLineUI.success(
            `# of users who don't follow you back: ${usersWhoDontFollowBackCount}`,
            "\n",
            "",
            false,
        );
        CommandLineUI.success(
            `${chalk.red("followers:following")} ratio -> ${
                followersCount / (followingCount > 0 ? followingCount : 1)
            }`,
            "\n",
            "\n",
            false,
        );
        CommandLineUI.error(
            usersWhoDontFollowBackList.join("  "),
            "",
            "\n",
            false,
        );
    }

    // Ask whether the user wants to store the list of users who don't follow back as json
    CommandLineUI.log("");
    if (
        await CommandLineUI.confirm(
            "Do you want to store the list of users who don't follow you back?",
        )
    ) {
        // Storing message
        CommandLineUI.info(
            `Storing the list of users who don't follow you back as json`,
            "\n",
            "\n",
        );

        // Storing the list of users who don't follow you back
        const TIMESTAMP = Date.now();
        const FILE_NAME = `${__dirname}/../../.bot_data/users_who_dont_follow_back_${TIMESTAMP}.json`;
        await fs.promises.writeFile(
            FILE_NAME,
            JSON.stringify({
                timestamp: Date.now(),
                followers_count: followersCount,
                following_count: followingCount,
                users_who_dont_follow_back_count: usersWhoDontFollowBackCount,
                users_who_dont_follow_back_list: usersWhoDontFollowBackList,
            }),
        );

        // Storing was successful message
        CommandLineUI.success(
            `Successfully stored the list of users who don't follow you back as json.\nCheckout ${FILE_NAME}`,
            "\n",
            "\n",
        );
    }

    CommandLineUI.success(
        `Successfully fetched the list of users who don't follow back`,
        "\n",
        "\n",
    );
    if (loggingEnabled) CommandLineUI.displayLoggingEndMessage();
}

async function unfollowUsersWhoDontFollowBack(
    bot: IgBot,
    loggingEnabled: boolean,
) {
    // Ask whether the user want to unfollow users who don't follow back as it potentially takes a long time and can get the user banned
    CommandLineUI.warn(
        ` This action can take a long time and can get the your account banned. \nIf your ${chalk.red(
            "followers:following",
        )} ratio is high, you shouldn't use this action.`,
        "\n",
        "\n",
    );

    if (!(await CommandLineUI.confirm("Do you want to continue?"))) {
        return CommandLineUI.info("Aborting action.");
    }

    // Display bot status and unfollow the users who don't follow back
    if (loggingEnabled) CommandLineUI.displayLoggingStartMessage();
    CommandLineUI.info(
        `Attempting to unfollow users who don't follow back`,
        "\n",
        "\n",
    );

    // Gets the list of users who don't follow back
    const {
        followers_count: followersCount,
        following_count: followingCount,
        users_who_dont_follow_back_count: usersWhoDontFollowBackCount,
        data: usersWhoDontFollowBackList,
    } = await bot.getUsersWhoDoNotFollowBack();

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
        CommandLineUI.success(
            `# of followers: ${followersCount}`,
            "\n",
            "",
            false,
        );
        CommandLineUI.success(
            `# of followings: ${followingCount}`,
            "\n",
            "",
            false,
        );
        CommandLineUI.success(
            `# of users who don't follow you back: ${usersWhoDontFollowBackCount}`,
            "\n",
            "",
            false,
        );
        CommandLineUI.success(
            `${chalk.red("followers:following")} ratio -> ${
                followersCount / (followingCount > 0 ? followingCount : 1)
            }`,
            "\n",
            "\n",
            false,
        );
        CommandLineUI.error(
            usersWhoDontFollowBackList.join("  "),
            "",
            "\n",
            false,
        );
    }

    // Ask whether the user wants to store the list of users who don't follow back as json
    CommandLineUI.log("");
    if (
        await CommandLineUI.confirm(
            "Do you want to store the list of users who don't follow you back?",
        )
    ) {
        // Storing message
        CommandLineUI.info(
            `Storing the list of users who don't follow you back as json`,
            "\n",
            "\n",
        );

        // Storing the list of users who don't follow you back
        const TIMESTAMP = Date.now();
        const FILE_NAME = `${__dirname}/../../.bot_data/users_who_dont_follow_back_${TIMESTAMP}.json`;
        await fs.promises.writeFile(
            FILE_NAME,
            JSON.stringify({
                timestamp: Date.now(),
                followers_count: followersCount,
                following_count: followingCount,
                users_who_dont_follow_back_count: usersWhoDontFollowBackCount,
                users_who_dont_follow_back_list: usersWhoDontFollowBackList,
            }),
        );

        // Storing was successful message
        CommandLineUI.success(
            `Successfully stored the list of users who don't follow you back as json.\nCheckout ${FILE_NAME}`,
            "\n",
            "\n",
        );
    }

    // Ask whether the user wants to unfollow safely or not
    CommandLineUI.warn(
        ` You have ${usersWhoDontFollowBackCount} users who don't follow you back.\n Since it's a huge number, chances are you might get banned if you unfollow\n them all at once. We recommend you to\n choose unfollow them one by one with a delay in between.`,
        "\n",
        "\n",
    );
    CommandLineUI.warn(
        ` Note: Unfollowing safely takes a long time as the algorithm tries it's best not to get banned.\n If you don't care about getting banned, then you can choose the later option${chalk.red(
            "[We recommend you to go with the safer option]",
        )}`,
        "",
        "\n",
    );

    await CommandLineUI.confirm("Do you want to unfollow safely?");

    // Unfollow the users who don't follow back safely
    CommandLineUI.info(
        `We prefer safety over speed. You have no option other than going safely 😉.`,
        "\n",
        "\n",
        false,
    );

    if (loggingEnabled) {
        CommandLineUI.displayLoggingStartMessage("UNFOLLOWING STARTED");
        CommandLineUI.log("");
    }

    await bot.safelyUnfollowUserList(
        usersWhoDontFollowBackList,
        usersWhoDontFollowBackCount,
    );

    CommandLineUI.success(
        `Successfully unfollowed the users who don't follow back`,
        "\n",
        "\n",
    );

    if (loggingEnabled)
        CommandLineUI.displayLoggingStartMessage("UNFOLLOWING ENDED");

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
            await getUserWhoDontFollowBack(bot, logger.allowLogging);
            break;
    }
}
