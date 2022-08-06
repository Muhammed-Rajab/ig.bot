import fs from "fs";
import { IgBot } from "../core/IgBot.js";
import { CommandLineUI } from "../cli/CommandLine.js";

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
        if (
            await CommandLineUI.confirm(
                "Do you want to display the list of users who follows you?",
            )
        ) {
            CommandLineUI.info(
                `Here's the list of users that are following you ⤵️`,
                "\n",
                "\n",
            );

            CommandLineUI.success(
                `# of followers: ${followersList.length}`,
                "\n",
                "",
                false,
            );

            CommandLineUI.error(followersList.join("  "), "", "\n", false);
        }

        // Ask the user whether to save the list of followers
        // Ask whether the user wants to store the list of followers as json
        CommandLineUI.log("");
        if (
            await CommandLineUI.confirm(
                "Do you want to store the list of users who are following you?",
            )
        ) {
            // Storing message
            CommandLineUI.info(
                `Storing the list of users who who are following you as json`,
                "\n",
                "\n",
            );

            // Storing the list of users who don't follow you back
            const TIMESTAMP = Date.now();
            const FILE_NAME = `${BOT_DATA_BASE_PATH}/followers_list_${TIMESTAMP}.json`;
            await fs.promises.writeFile(
                FILE_NAME,
                JSON.stringify({
                    timestamp: Date.now(),
                    following_count: followersList.length,
                    following_list: followersList,
                }),
            );

            // Storing was successful message
            CommandLineUI.success(
                `Successfully stored the list of users who who are following you as json.\nCheckout ${FILE_NAME}`,
                "\n",
                "\n",
            );
        }
        if (loggingEnabled) CommandLineUI.displayLoggingEndMessage();
    } catch (err) {
        throw new Error(
            `Something Went Wrong While Trying To Get User's Followers List.\n${err.message}`,
        );
    }
}
