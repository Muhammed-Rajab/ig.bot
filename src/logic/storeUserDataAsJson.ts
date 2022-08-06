import fs from "fs";
import { CommandLineUI } from "../cli/CommandLine.js";

export default async function storeUserDataAsJson(
    dataDescription: string,
    data: object,
    BASE_PATH: string,
    FILE_NAME_: string,
) {
    if (
        await CommandLineUI.confirm(
            `Do you want to store the ${dataDescription}?`,
        )
    ) {
        // Storing message
        CommandLineUI.info(
            `Storing the ${dataDescription} as json`,
            "\n",
            "\n",
        );

        // Storing the list of users who don't follow you back
        const TIMESTAMP = Date.now();
        const FILE_NAME = `${BASE_PATH}/${FILE_NAME_}_${TIMESTAMP}.json`;
        await fs.promises.writeFile(
            FILE_NAME,
            JSON.stringify({
                timestamp: Date.now(),
                ...data,
            }),
        );

        // Storing was successful message
        CommandLineUI.success(
            `Successfully stored the ${dataDescription} as json.\nCheckout ${FILE_NAME}`,
            "\n",
            "\n",
        );
    }
}
