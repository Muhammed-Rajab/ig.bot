/* eslint-disable */
export {};
const IgBot = require("./IgBot");
const dotenv = require("dotenv");
const { logger } = require("./utils");

// Loading Environment Variables
dotenv.config({
    path: `${__dirname}/../config.env`,
});

// Instauto configuration
const instautoConfig = {
    cookiesPath: "./cookies.json",

    username: process.env.INSTAGRAM_USERNAME,
    password: process.env.INSTAGRAM_PASSWORD,

    maxFollowsPerHour: 60,
    maxFollowsPerDay: 150,
    maxLikesPerDay: 50,

    followUserRatioMin: 0.2,
    followUserRatioMax: 4.0,
    followUserMaxFollowers: null,
    followUserMaxFollowing: null,
    followUserMinFollowers: null,
    followUserMinFollowing: null,

    shouldFollowUser: null,
    dontUnfollowUntilTimeElapsed: 3 * 24 * 60 * 60 * 1000,
    excludeUsers: [],
    dryRun: false,
};

// Puppeteer configuration
const puppeteerConfig = { headless: false };

// Bot instance
const bot = new IgBot(puppeteerConfig, { ...instautoConfig, logger });

// Main function
async function main() {
    try {
        // Initialize the bot instance
        await bot.initialize();

        // Fetches and prints user data
        console.log(await bot.getUserData());

        // Sleep for 10 seconds
        await bot.sleep(10);
    } catch (err) {
        console.error(err);
    } finally {
        console.log("Closing browser");
        await bot.close();
    }
}

main();
