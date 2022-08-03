import { CommandLineUI } from "../cli/CommandLine.js";

export async function displayEndScreen() {
    // Clears the command line
    CommandLineUI.clear();

    // Prints the message
    console.log(
        `Thank you for using ig.bot💖\nCheckout other apps in https://github.com/Muhammed-Rajab?tab=repositories`,
    );
}
