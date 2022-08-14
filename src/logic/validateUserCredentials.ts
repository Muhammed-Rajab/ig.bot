import { CommandLineUI } from "../cli/CommandLine.js";
import InstautoConfig from "../config/InstautoConfig.js";
import PuppeteerConfig from "../config/PuppeteerConfig.js";
import { IgBot } from "../core/IgBot.js";
import logger from "../core/logger.js";
import { sleep } from "../utils.js";
import { fileURLToPath } from "url";
import path from "path";

// Loading Environment Variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async function (
    USERNAME: string,
    PASSWORD: string,
): Promise<void> {
    /* Function to manually check if the username and password are correct*/
    let bot: IgBot;
    try {
        // Remove preexisting cookies file
        // Login to account and ask whether the credentials are correct
        bot = new IgBot(
            PuppeteerConfig,
            {
                ...InstautoConfig,
                logger: logger.getLogger(),
                username: USERNAME,
                password: PASSWORD,
                cookiesPath: `${__dirname}/../../bot_data/cookies.json`,
            },
            {
                followedDbPath: `${__dirname}/../../bot_data/followed.json`,
                unfollowedDbPath: `${__dirname}/../../bot_data/unfollowed.json`,
                likedPhotosDbPath: `${__dirname}/../../bot_data/likedPhotos.json`,
                logger: logger.getLogger(),
            },
        );

        // Inform the user that the bot is going to start to check if the login credentials are correct
        CommandLineUI.info(
            `Make sure to check whether the login was successful.`,
        );
        CommandLineUI.info(`Launching Instagram Window in 3 seconds🚀`);
        await sleep(3000);
        await bot.initialize();
        CommandLineUI.info(
            `Waiting for another 10 seconds for user to check if the login was successful 🗝️`,
        );
        await sleep(10000);
        CommandLineUI.success(`Logging out of Instagram🗝️`);
        CommandLineUI.success(`Validated Instagram credentials successfully🗝️`);
    } catch (e) {
        CommandLineUI.error(`Validated Instagram credentials failed🗝️`);
        CommandLineUI.error(`${e}`);
    } finally {
        await bot.close();
    }
}
