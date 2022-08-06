import fs from "fs";
import { IgBot } from "../core/IgBot.js";
import { CommandLineUI } from "../cli/CommandLine.js";
import storeUserDataAsJson from "./storeUserDataAsJson.js";
import displayUserData from "./displayUserData.js";

export default async function getFollowersList(
    bot: IgBot,
    loggingEnabled: boolean,
    BOT_DATA_BASE_PATH: string,
) {
    try {
        CommandLineUI.log("");

        // Display bot status and follow the user
        if (loggingEnabled) CommandLineUI.displayLoggingStartMessage();

        CommandLineUI.info(
            `Attempting to get user's followers list`,
            "\n",
            "\n",
        );

        const followersList = await bot.getFollowersList();

        CommandLineUI.success(
            `Successfully fetched users's followers list`,
            "\n",
            "\n",
        );

        // Ask the user whether to display the list of following
        CommandLineUI.log("");
        await displayUserData(
            "Do you want to display the list of users who follows you?",
            [
                () =>
                    CommandLineUI.info(
                        `Here's the list of users that are following you ⤵️`,
                        "\n",
                        "\n",
                    ),
                () =>
                    CommandLineUI.success(
                        `# of followers: ${followersList.length}`,
                        "\n",
                        "",
                        false,
                    ),
                () =>
                    CommandLineUI.error(
                        followersList.join("  "),
                        "",
                        "\n",
                        false,
                    ),
            ],
        );

        // Ask the user whether to save the list of followers
        CommandLineUI.log("");

        await storeUserDataAsJson(
            `list of users who are following you`,
            {
                following_count: followersList.length,
                following_list: followersList,
            },
            BOT_DATA_BASE_PATH,
            "followers_list",
        );

        if (loggingEnabled) CommandLineUI.displayLoggingEndMessage();
    } catch (err) {
        throw new Error(
            `Something Went Wrong While Trying To Get User's Followers List.\n${err.message}`,
        );
    }
}
