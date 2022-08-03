// Importing modules and libraries
import chalk from "chalk";
import { IgBot } from "../core/IgBot.js";
import { createSpinner } from "nanospinner";
import { CommandLineUI } from "../cli/CommandLine.js";

// Importin configurations
import InstautoConfig from "../config/InstautoConfig.js";
import PuppeteerConfig from "../config/PuppeteerConfig.js";

// Configuring the logger
const logger = {
    allowLogging: false,
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
            `\nMake sure that you have provided valid credentials to the ig.bot.`,
        );
        CommandLineUI.warn(
            `If not, please go back to main menu and provide valid credentials.`,
        );
        CommandLineUI.warn(
            `If you don't know whether the credentials are valid or not, then`,
        );
        CommandLineUI.warn(
            `please go back to the main menu and choose 'Validate User Credentials✅'\nfrom the list.\n`,
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

    // Initialize the bot and show the spinner
    console.log();
    const spinner = createSpinner(
        `${chalk.blue.bold("Initializing ig.bot🚀")}`,
    ).start();
    await bot.initialize();
    spinner.success({
        text: `${chalk.green.bold("ig.bot initialized successfully🚀")}`,
    });
    console.log();

    // Run a loop to create an interface between the bot and the user
    let botIsRunning: boolean = false;

    while (botIsRunning) {}

    botIsRunning || (await bot.close());
}
