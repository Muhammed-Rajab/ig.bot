const log = (fn, ...args) => console[fn](new Date().toISOString(), ...args);
const logger = Object.fromEntries(
    ["log", "info", "debug", "error", "trace", "warn"].map((fn) => [
        fn,
        (...args) => log(fn, ...args),
    ]),
);

// Promisified version of setTimeout
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export { sleep, logger };
