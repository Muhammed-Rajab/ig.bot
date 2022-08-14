import chalk from "chalk";
import gradient from "gradient-string";
import figlet from "figlet";
import { CommandLineUI } from "../cli/CommandLine.js";

export default async function () {
    /* Function to display details about the developer */
    CommandLineUI.clear();

    // About the developer
    const displayBox = [
        "██████████████████████████████",
        "██                          ██",
        "██    About The Developer   ██",
        "██                          ██",
        "██████████████████████████████",
    ].join("\n");

    console.log(gradient.pastel.multiline(displayBox));

    // Banner
    console.log("");
    console.log(
        gradient.pastel(
            figlet.textSync("Rajab", {
                font: "NV Script",
                horizontalLayout: "default",
                verticalLayout: "default",
                width: 80,
                whitespaceBreak: true,
            }),
        ),
    );

    // Description
    CommandLineUI.success(
        `This application is developed by ${chalk.yellow(
            "Rajab",
        )}, who is a 16-year-old self-taught developer\n Who started his journey in the world of programming in the year of 2019.\n He is an amazing Full Stack Developer, who's focusing on the Backend Development.\n He loves to learn new technologies and build amazing projects in it. `,
        "\n",
        "\n",
        false,
    );

    // Links
    CommandLineUI.error(`You can connect with him on ⤵`, "", "\n", false);
    CommandLineUI.success(
        `Github: https://github.com/Muhammed-Rajab`,
        "\t 1.",
        undefined,
        false,
    );
    CommandLineUI.success(
        `Instagram: https://instagram.com/shehatesmyusername`,
        "\t 2.",
        undefined,
        false,
    );
    CommandLineUI.success(
        `LinkedIn: https://www.linkedin.com/in/rajab-kabeer/`,
        "\t 3.",
        undefined,
        false,
    );
    CommandLineUI.log("");
}
