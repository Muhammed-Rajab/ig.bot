import chalk from "chalk";
import figlet from "figlet";
import inquirer from "inquirer";
import gradient from "gradient-string";

class CommandLine {
    // Displays banner
    static displayBanner(): void {
        const title = "ig.bot";
        const subtitle = `
                                                        
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
        console.log();
        console.log();
    }

    // Clears the terminal
    static clear(): void {
        console.clear();
    }

    // Asks user to select either Y or n -> true on Y, false on n
    public static async confirm(
        name: string,
        message: string,
    ): Promise<boolean> {
        return (
            await inquirer.prompt({
                name: name,
                message: message,
                type: "confirm",
            })
        )[name];
    }

    // Takes text input from user
    public static async input(
        name: string,
        message: string,
        options: object = {},
    ): Promise<string> {
        return (
            await inquirer.prompt({
                name: name,
                message: message,
                type: "input",
                ...options,
            })
        )[name];
    }
}

interface GenerateListBasedMenuChoice {
    name: string;
    callback: (option: string) => any;
}

interface GenerateListBasedMenuConfig {
    title: string;
    option_name: string;
    choices: GenerateListBasedMenuChoice[];
    defaultIndex: number;
}

/*
    A class to handle everything related to command line including
    generation of beautiful text, user input, cleaning, animation, etc.
*/
class CommandLineUI extends CommandLine {
    // Prints the current page name in a clean manner
    public static printCurrentPageName(pageName: string): void {
        console.log(
            chalk.bold.italic(
                `\nYou are currently in 📖: ${chalk.blue(` ${pageName} `)}\n`,
            ),
        );
    }

    // Asks for user to select an option from list
    private static async _chooseFromList(
        name: string,
        question: string,
        choices: string[],
        defaultIndex: number,
    ): Promise<string | undefined> {
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

    // Generates a list based option selector
    public static async generateListBasedMenu(options) {
        const { title, option_name, choices, defaultIndex } = options;

        let optionSelected;

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
