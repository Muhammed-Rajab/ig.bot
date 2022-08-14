import { CommandLineUI } from "../cli/CommandLine.js";

export async function displayEndScreen() {
    // Clears the command line
    CommandLineUI.clear();

    CommandLineUI.displayBanner();

    // Prints the message
    CommandLineUI.success(
        "Thank you for using ig.bot💖",
        undefined,
        undefined,
        false,
    );
    CommandLineUI.success(
        "Make sure to this project a ⭐ at https://github.com/Muhammed-Rajab/ig.bot",
        undefined,
        undefined,
        false,
    );
}
