import chalk from "chalk";
import figlet from "figlet";
import inquirer from "inquirer";
import gradient from "gradient-string";

class CommandLine {
    /* A class to handle basic I/O from the command line interface */

    public static clear(): void {
        /* Clears the terminal */
        console.clear();
    }

    public static async confirm(
        message: string,
        options: object = {},
    ): Promise<boolean> {
        /* Asks user to select either Y or n -> true on Y/[Enter], false on anything else */

        const name = `${Math.floor(Math.random() * 1000000 * Date.now())}`;
        return (
            await inquirer.prompt({
                name: name,
                message: message,
                type: "confirm",
                ...options,
            })
        )[name];
    }

    public static async textInput(
        message: string,
        options: object = {},
    ): Promise<string> {
        /* Takes text input from user */

        const name = `${Math.floor(Math.random() * 1000000 * Date.now())}`;
        return (
            await inquirer.prompt({
                name: name,
                message: message,
                type: "input",
                ...options,
            })
        )[name];
    }

    public static async passwordInput(
        message: string,
        options: object = {},
    ): Promise<string> {
        /*  Takes password from the user */
        const name = `${Math.floor(Math.random() * 1000000 * Date.now())}`;
        return (
            await inquirer.prompt({
                name: name,
                message: message,
                type: "password",
                mask: "🖕",
                ...options,
            })
        )[name];
    }
}

interface GenerateListBasedMenuChoice {
    /* Interface for choices int the List based menu*/
    name: string;
    callback: (option: string) => any;
}

interface GenerateListBasedMenuConfig {
    /* Interface for configuration of GenerateListBasedMenu */
    title: string;
    option_name: string;
    choices: GenerateListBasedMenuChoice[];
    defaultIndex: number;
}

class CommandLineUI extends CommandLine {
    /*
        A class to handle everything related to command line including
        generation of beautiful text, user input, cleaning, animation, etc.
    */

    public static displayBanner(): void {
        /* Displays banner */
        const title: string = "ig.bot";
        const subtitle: string = `
                                                        
    💖💖 The only instagram toolkit you need 💖💖       
                                                        `;

        console.log(chalk.bgGreen.bold(subtitle));
        console.log(
            gradient.atlas(
                figlet.textSync(title, {
                    font: "NV Script",
                    horizontalLayout: "default",
                    verticalLayout: "default",
                    width: 80,
                    whitespaceBreak: true,
                }),
            ),
        );
        console.log("\n\n");
    }

    public static printCurrentPageName(pageName: string): void {
        /* Prints the current page name in a clean manner */
        console.log(
            chalk.bold.italic(
                `\nYou are currently in 📖: ${chalk.blue(` ${pageName} `)}\n`,
            ),
        );
    }

    private static async _chooseFromList(
        name: string,
        question: string,
        choices: string[],
        defaultIndex: number,
    ): Promise<string | undefined> {
        /* Asks for user to select an option from list */
        return (
            await inquirer.prompt({
                name: name,
                type: "list",
                message: question,
                choices: choices,
                default() {
                    return choices[defaultIndex];
                },
                // prefix: "➡️ ",
            })
        )[name];
    }

    public static async generateListBasedMenu(options) {
        /* Generates a list-like menu from which user can choose options */

        const { title, option_name, choices, defaultIndex } = options;

        let optionSelected: string;

        do {
            optionSelected = await this._chooseFromList(
                option_name,
                title,
                choices.map((choice) => choice.name),
                defaultIndex,
            );
        } while (optionSelected === undefined);

        for (let i = 0; i < choices.length; i++) {
            if (choices[i].name === optionSelected) {
                await choices[i].callback(optionSelected);
            }
        }
    }
}

export { GenerateListBasedMenuConfig, CommandLineUI };
