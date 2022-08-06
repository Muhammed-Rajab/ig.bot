import { IgBot } from "../core/IgBot.js";
import { CommandLineUI } from "../cli/CommandLine.js";

export default async function unfollowUser(
    bot: IgBot,
    loggingEnabled: boolean,
) {
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
