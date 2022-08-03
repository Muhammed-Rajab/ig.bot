// Importing modules and libraries
import chalk from "chalk";
import { IgBot } from "../core/IgBot.js";
import { createSpinner } from "nanospinner";
import { CommandLineUI } from "../cli/CommandLine.js";

// Importin configurations
import InstautoConfig from "../config/InstautoConfig.js";
import PuppeteerConfig from "../config/PuppeteerConfig.js";
import { displayBotMenu } from "../components/BotMenu.js";

// Configuring the logger
const logger = {
    allowLogging: true,
    getLogger() {
        const methods = ["log", "info", "debug", "error", "trace", "warn"];

        const log = (fn: any, ...args: any[]) =>
            console[fn](new Date().toISOString(), ...args);

        return Object.fromEntries(
            methods.map((fn) => [
                fn,
                (...args) => {
                    if (this.allowLogging) log(fn, ...args);
                },
            ]),
        );
    },
};

export default async function (
    USERNAME: string,
    PASSWORD: string,
): Promise<void> {
    /* Function to provide the user access to the ig.bot interface */

    // Warning the user about providing valid credentials
    {
        CommandLineUI.warn(
            ` Make sure that you have provided valid credentials to the ig.bot.`,
            "\n",
        );
        CommandLineUI.warn(
            `If not, please go back to main menu and provide valid credentials.`,
            undefined,
            undefined,
            false,
        );
        CommandLineUI.warn(
            `If you don't know whether the credentials are valid or not, then`,
            undefined,
            undefined,
            false,
        );
        CommandLineUI.warn(
            `please go back to the main menu and choose 'Validate User Credentials✅'\n from the list.\n`,
            undefined,
            undefined,
            false,
        );
    }
    if (!(await CommandLineUI.confirm(`Do you want to bootup the ig.bot🚀?`)))
        return;

    // Bot instance
    const bot = new IgBot(PuppeteerConfig, {
        ...InstautoConfig,
        logger: logger.getLogger(),
        username: USERNAME,
        password: PASSWORD,
    });

    // Setting the logger to false, so that the user can't see the logs
    logger.allowLogging = false;

    // Initialize the bot and show the spinner
    CommandLineUI.log("");
    const spinner = createSpinner(
        `${chalk.blue.bold("Initializing ig.bot🚀")}`,
    ).start();
    // await bot.initialize();
    spinner.success({
        text: `${chalk.green.bold("ig.bot initialized successfully🚀")}`,
    });
    CommandLineUI.log("");

    // Resetting the logger to true, so that the user can see the logs
    logger.allowLogging = true;

    // Run a loop to create an interface between the bot and the user
    let botIsRunning: boolean = true;

    while (botIsRunning) {
        // Ask the user if the login was successful if the bot is not running headless
        if (!PuppeteerConfig.headless) {
            if (!(await CommandLineUI.confirm(`Was the login successful?📃`))) {
                botIsRunning = false;
                CommandLineUI.error("Exiting the ig.bot🚀", "\n", "\n");
                break;
            } else {
                CommandLineUI.success(
                    "Logged into Instagram Successfully🎊",
                    "\n",
                    "\n",
                );
            }
        }

        // Display the bot menu
        await displayBotMenu(bot);
    }

    // botIsRunning || (await bot.close());
}
