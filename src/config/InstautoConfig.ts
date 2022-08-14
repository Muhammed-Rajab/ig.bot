export default {
    username: undefined, // Provide your username here
    password: undefined, // Provide your password here

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
