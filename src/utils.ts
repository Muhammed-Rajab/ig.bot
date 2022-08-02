const log = (fn: any, ...args: any[]) =>
    console[fn](new Date().toISOString(), ...args);
const logger = Object.fromEntries(
    ["log", "info", "debug", "error", "trace", "warn"].map((fn) => [
        fn,
        (...args) => log(fn, ...args),
    ]),
);

// Promisified version of setTimeout
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ! Function to find difference between two sets
async function setDifference(
    s1: Set<string>,
    s2: Set<string>,
): Promise<Set<string>> {
    const newSet: Set<string> = new Set<string>();
    s1.forEach((elem: string) => newSet.add(elem));
    s2.forEach((elem: string) => newSet.delete(elem));
    return newSet;
}

export { sleep, logger, setDifference };
