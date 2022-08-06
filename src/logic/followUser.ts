import { IgBot } from "../core/IgBot.js";
import { CommandLineUI } from "../cli/CommandLine.js";

export default async function followUser(bot: IgBot, loggingEnabled: boolean) {
    try {
        CommandLineUI.log("");

        let userToFollow: string = await CommandLineUI.textInputLooped(
            "Enter the username to follow: ",
        );

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
