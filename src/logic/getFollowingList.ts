import fs from "fs";
import { IgBot } from "../core/IgBot.js";
import displayUserData from "./displayUserData.js";
import { CommandLineUI } from "../cli/CommandLine.js";
import storeUserDataAsJson from "./storeUserDataAsJson.js";

export default async function getFollowingList(
    bot: IgBot,
    loggingEnabled: boolean,
    BOT_DATA_BASE_PATH: string,
) {
    try {
        CommandLineUI.log("");

        // Display bot status and follow the user
        if (loggingEnabled) CommandLineUI.displayLoggingStartMessage();
        CommandLineUI.info(
            `Attempting to get user's following list`,
            "\n",
            "\n",
        );

        const followingList = await bot.getFollowingList();
        CommandLineUI.success(
            `Successfully fetched users's following list`,
            "\n",
            "\n",
        );

        // Ask the user whether to display the list of following
        CommandLineUI.log("");
        await displayUserData(
            "Do you want to display the list of users who you are following?",
            [
                () =>
                    CommandLineUI.info(
                        `Here's the list of users that you are following ⤵️`,
                        "\n",
                        "\n",
                    ),
                () =>
                    CommandLineUI.success(
                        `# of followings: ${followingList.length}`,
                        "\n",
                        "",
                        false,
                    ),
                () =>
                    CommandLineUI.error(
                        followingList.join("  "),
                        "",
                        "\n",
                        false,
                    ),
            ],
        );

        // Ask the user whether to save the list of following
        // Ask whether the user wants to store the list of users who are following as json
        CommandLineUI.log("");
        await storeUserDataAsJson(
            "list of users who you are following",
            {
                following_count: followingList.length,
                following_list: followingList,
            },
            BOT_DATA_BASE_PATH,
            "following_list",
        );

        if (loggingEnabled) CommandLineUI.displayLoggingEndMessage();
    } catch (err) {
        throw new Error(
            `Something Went Wrong While Trying To Get User's Following List.\n${err.message}`,
        );
    }
}
