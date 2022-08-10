import { CommandLineUI } from "../cli/CommandLine.js";

// Configuring the logger
export default {
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
