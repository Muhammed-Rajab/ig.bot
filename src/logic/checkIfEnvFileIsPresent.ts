import fs from "node:fs";
import chalk from "chalk";
import { CommandLineUI } from "../cli/CommandLine.js";

export default async function checkIfEnvFileIsPresent(ENV_FILE_PATH: string) {
    if (fs.existsSync(ENV_FILE_PATH)) {
        CommandLineUI.success("Found config.env file");
    } else {
        CommandLineUI.error("Could not find config.env file");
        if (
            await CommandLineUI.confirm(
                "Do you want to create a config.env file?",
            )
        ) {
            // * Ask for username and password
            const username = await CommandLineUI.textInputLooped(
                "Enter your Instagram Username: ",
            );
            const password = await CommandLineUI.passwordInputLooped(
                "Enter your Instagram Password: ",
            );
            const ENV_FILE_CONTENT = `INSTAGRAM_USERNAME="${username}"\nINSTAGRAM_PASSWORD="${password}"`;

            CommandLineUI.info("Creating config.env file");
            fs.writeFileSync(ENV_FILE_PATH, ENV_FILE_CONTENT);
            CommandLineUI.success("Successfully created config.env file");
        } else {
            CommandLineUI.error(
                `Exiting application now as no config.env file was found. Goto ${chalk.underline(
                    "https://github.com/Muhammed-Rajab/ig.bot",
                )} to know more.`,
            );
            process.exit(1);
        }
    }
}
