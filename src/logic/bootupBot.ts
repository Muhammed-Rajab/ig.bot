// Importing modules and libraries
import chalk from "chalk";
import { IgBot } from "../core/IgBot.js";
import { createSpinner } from "nanospinner";
import { CommandLineUI } from "../cli/CommandLine.js";

// Importin configurations
import InstautoConfig from "../config/InstautoConfig.js";
import PuppeteerConfig from "../config/PuppeteerConfig.js";
import { displayBotMenu } from "../components/BotMenu.js";
import { sleep } from "../utils.js";

// Configuring the logger
const logger = {
    allowLogging: true,
    getLogger() {
        return {
            log: (...args: any[]) =>
                this.allowLogging &&
                CommandLineUI.success(
                    `${new Date().toISOString()} ${args.join(" ")}`,
                ),
            info: (...args: any[]) =>
                this.allowLogging &&
                CommandLineUI.info(
                    `${new Date().toISOString()} ${args.join(" ")}`,
                ),
            error: (...args: any[]) =>
                this.allowLogging &&
                CommandLineUI.error(
                    `${new Date().toISOString()} ${args.join(" ")}`,
                ),
            trace: (...args: any[]) =>
                this.allowLogging &&
                CommandLineUI.log(
                    `${new Date().toISOString()} ${args.join(" ")}`,
                ),
            warn: (...args: any[]) =>
                this.allowLogging &&
                CommandLineUI.warn(
                    `${new Date().toISOString()}  ${args.join(" ")}`,
                ),
            debug: (...args: any[]) =>
                this.allowLogging &&
                CommandLineUI.error(
                    `${new Date().toISOString()} ${args.join(" ")}`,
                ),
        };
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

    let botIsRunning: boolean = true;

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
    await bot.initialize();
    spinner.success({
        text: `${chalk.green.bold("ig.bot initialized successfully🚀")}`,
    });
    CommandLineUI.log("");

    // Resetting the logger to true, so that the user can see the logs
    logger.allowLogging = true;

    // Run a loop to create an interface between the bot and the user
    let askWhetherTheLoginWasSuccessful: boolean = true;

    // Ask whether the user wants to get the logging status of the bot
    logger.allowLogging = await CommandLineUI.confirm(
        "Do you want to get the logging status of the bot?",
    );

    try {
        while (botIsRunning) {
            // Ask the user if the login was successful if the bot is not running headless
            if (!PuppeteerConfig.headless && askWhetherTheLoginWasSuccessful) {
                CommandLineUI.log("");
                if (
                    !(await CommandLineUI.confirm(
                        `Was the login successful?📃`,
                    ))
                ) {
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
                askWhetherTheLoginWasSuccessful = false;
            }

            try {
                // Display the bot menu and if it returns false, then exit the bot
                if ((await displayBotMenu(bot, logger)) === false) {
                    botIsRunning = false;
                    await bot.close();
                    CommandLineUI.error("Exiting the ig.bot🚀", "\n", "\n");
                    await sleep(1000);
                    break;
                }

                // Ask if the user want to continue using the app
                botIsRunning = await CommandLineUI.confirm(
                    "Do you want to continue to Bot Menu📃?",
                );
            } catch (e) {
                // Print out the error message
                CommandLineUI.error(e.message, "\n", "\n");

                // Ask whether the user wants to continue using the bot menu
                botIsRunning = await CommandLineUI.confirm(
                    "Do you want to continue to Bot Menu📃?",
                );
            } finally {
                // Clear the screen
                CommandLineUI.clear();
            }
        }
    } catch (e) {
        CommandLineUI.error(`Error occured: ${e.message}`, `\n`, "\n");
    } finally {
        await bot.close();
    }
}
