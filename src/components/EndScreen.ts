import { CommandLineUI } from "../cli/CommandLine.js";

export async function displayEndScreen() {
    // Clears the command line
    CommandLineUI.clear();

    // Prints the message
    CommandLineUI.success(
        "Thank you for using ig.bot💖",
        undefined,
        undefined,
        false,
    );
    CommandLineUI.success(
        "Make sure to this project ⭐ at https://github.com/Muhammed-Rajab/ig.bot",
        undefined,
        undefined,
        false,
    );
}
