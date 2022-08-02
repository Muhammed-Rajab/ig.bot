export default {
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
