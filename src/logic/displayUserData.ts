import { CommandLineUI } from "../cli/CommandLine.js";

export default async function displayUserData(
    confirmationMessage: string,
    funcs: { (): void }[],
) {
    CommandLineUI.log("");
    const consent = await CommandLineUI.confirm(confirmationMessage);
    if (consent) {
        funcs.forEach((fn) => fn());
    }
}
