import fs from "fs";
import chalk from "chalk";
import { CommandLineUI } from "../cli/CommandLine.js";
import { IgBot, usersWhoDontWantToFollowBack } from "../core/IgBot.js";

export default async function getUserWhoDontFollowBack(
    bot: IgBot,
    loggingEnabled: boolean,
    BOT_DATA_BASE_PATH: string,
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
        const FILE_NAME = `${BOT_DATA_BASE_PATH}/users_who_dont_follow_back_${TIMESTAMP}.json`;
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
