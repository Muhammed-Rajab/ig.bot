export {};

const log = (fn, ...args) => console[fn](new Date().toISOString(), ...args);
exports.logger = Object.fromEntries(
    ["log", "info", "debug", "error", "trace", "warn"].map((fn) => [
        fn,
        (...args) => log(fn, ...args),
    ]),
);
