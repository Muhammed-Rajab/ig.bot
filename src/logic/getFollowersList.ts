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
        if (
            await CommandLineUI.confirm(
                "Do you want to display the list of users who you are following?",
            )
        ) {
            CommandLineUI.info(
                `Here's the list of users that you are following ⤵️`,
                "\n",
                "\n",
            );

            CommandLineUI.success(
                `# of followings: ${followingList.length}`,
                "\n",
                "",
                false,
            );

            CommandLineUI.error(followingList.join("  "), "", "\n", false);
        }

        // Ask the user whether to save the list of following
        // Ask whether the user wants to store the list of users who don't follow back as json
        CommandLineUI.log("");
        if (
            await CommandLineUI.confirm(
                "Do you want to store the list of users who you are following?",
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
            const FILE_NAME = `${BOT_DATA_BASE_PATH}/following_list_${TIMESTAMP}.json`;
            await fs.promises.writeFile(
                FILE_NAME,
                JSON.stringify({
                    timestamp: Date.now(),
                    following_count: followingList.length,
                    following_list: followingList,
                }),
            );

            // Storing was successful message
            CommandLineUI.success(
                `Successfully stored the list of users who you are following as json.\nCheckout ${FILE_NAME}`,
                "\n",
                "\n",
            );
        }
        if (loggingEnabled) CommandLineUI.displayLoggingEndMessage();
    } catch (err) {
        throw new Error(
            `Something Went Wrong While Trying To Get User's Following List.\n${err.message}`,
        );
    }
}
