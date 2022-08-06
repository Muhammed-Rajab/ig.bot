import chalk from "chalk";
import { IgBot } from "../core/IgBot.js";
import { CommandLineUI } from "../cli/CommandLine.js";
import displayUserData from "./displayUserData.js";
import storeUserDataAsJson from "./storeUserDataAsJson.js";

export default async function unfollowUsersWhoDontFollowBack(
    bot: IgBot,
    loggingEnabled: boolean,
    BOT_DATA_BASE_PATH: string,
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
        return CommandLineUI.info("Aborting action.❌");
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
    await displayUserData(
        "Do you want to display the list of users who don't follow you back?",
        [
            () =>
                CommandLineUI.info(
                    `Here's the list of users who don't follow you back ⤵️`,
                    "\n",
                    "\n",
                ),
            () =>
                CommandLineUI.success(
                    `# of followers: ${followersCount}`,
                    "\n",
                    "",
                    false,
                ),
            () =>
                CommandLineUI.success(
                    `# of followings: ${followingCount}`,
                    "\n",
                    "",
                    false,
                ),
            () =>
                CommandLineUI.success(
                    `# of users who don't follow you back: ${usersWhoDontFollowBackCount}`,
                    "\n",
                    "",
                    false,
                ),
            () =>
                CommandLineUI.success(
                    `${chalk.red("followers:following")} ratio -> ${
                        followersCount /
                        (followingCount > 0 ? followingCount : 1)
                    }`,
                    "\n",
                    "\n",
                    false,
                ),
            () =>
                CommandLineUI.error(
                    usersWhoDontFollowBackList.join("  "),
                    "",
                    "\n",
                    false,
                ),
        ],
    );

    // Ask whether the user wants to store the list of users who don't follow back as json
    CommandLineUI.log("");
    await storeUserDataAsJson(
        "list of users who don't follow you back",
        {
            followers_count: followersCount,
            following_count: followingCount,
            users_who_dont_follow_back_count: usersWhoDontFollowBackCount,
            users_who_dont_follow_back_list: usersWhoDontFollowBackList,
        },
        BOT_DATA_BASE_PATH,
        "users_who_dont_follow_back_list",
    );

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
