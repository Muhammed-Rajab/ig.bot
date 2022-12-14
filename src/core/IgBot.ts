// Necessary libraries
import Instauto from "instauto";
import puppeteer from "puppeteer";
import { setDifference } from "../utils.js";

interface PuppeteerConfig {
    /* Interface of puppeteer configuration object */
    headless: boolean;
}

interface InstautoConfig {
    /* Interface of Instauto configuration object */
    cookiesPath: string;
    username: string;
    password: string;

    maxFollowsPerHour: number;
    maxFollowsPerDay: number;
    maxLikesPerDay?: number;

    followUserRatioMin?: number;
    followUserRatioMax?: number;
    followUserMaxFollowers?: number;
    followUserMinFollowing?: number;
    followUserMaxFollowing?: number;
    followUserMinFollowers?: number;

    shouldFollowUser?: string[];
    dontUnfollowUntilTimeElapsed?: number;
    excludeUsers?: string[];
    dryRun?: boolean;
    logger?: object;
}

interface UserDetails {
    /* Interface for user details from instagram */
    username: string;
    biography?: string;
    biolinks?: string[];
    external_url?: string;
    edge_followed_by: { count: number };
    edge_follow: { count: number };
    full_name: string;
    id: string;
    is_business_account: boolean;
    is_joined_recently: boolean;
    is_private: boolean;
    is_verified: boolean;
}

interface usersWhoDontWantToFollowBack {
    followers_count: number;
    following_count: number;
    users_who_dont_follow_back_count: number;
    data: string[];
}

interface InstautoJsonDBConfig {
    followedDbPath: string;
    unfollowedDbPath: string;
    likedPhotosDbPath: string;
    logger: object;
}

class IgBot {
    private _browser: any;
    private _instauto: any;
    private _initCalled: boolean = false;

    // Constructor
    public constructor(
        private _puppeteerConfig: PuppeteerConfig,
        private _instautoConfig: InstautoConfig,
        private _instautoJsonDBConfig: InstautoJsonDBConfig,
    ) {}

    public async initialize() {
        /* Method to initialize the browser instance */
        this._browser = await puppeteer.launch(this._puppeteerConfig);

        const instautoDb = await Instauto.JSONDB(this._instautoJsonDBConfig);

        this._instauto = await Instauto(instautoDb, this._browser, {
            ...this._instautoConfig,
        });
        this._initCalled = true;
    }

    // Helper methods

    // Custom methods
    public async getFollowingList(): Promise<string[]> {
        this.throwErrorIfDidNotInitialize();

        const { id: userId } = await this._instauto.navigateToUserAndGetData(
            this._instautoConfig.username,
        );

        return await this._instauto.getFollowersOrFollowing({
            userId,
        });
    }

    public async getFollowersList(): Promise<string[]> {
        this.throwErrorIfDidNotInitialize();

        const { id: userId } = await this._instauto.navigateToUserAndGetData(
            this._instautoConfig.username,
        );

        return await this._instauto.getFollowersOrFollowing({
            userId,
            getFollowers: true,
        });
    }

    public async getUsersWhoDoNotFollowBack(): Promise<usersWhoDontWantToFollowBack> {
        this.throwErrorIfDidNotInitialize();

        const { id: userId } = await this._instauto.navigateToUserAndGetData(
            this._instautoConfig.username,
        );

        const userFollowingSet: Set<string> = new Set(
            await this._instauto.getFollowersOrFollowing({
                userId,
            }),
        );

        const userFollowersSet: Set<string> = new Set<string>(
            await this._instauto.getFollowersOrFollowing({
                userId,
                getFollowers: true,
            }),
        );

        const res: Set<string> = await setDifference(
            userFollowingSet,
            userFollowersSet,
        );

        const resAsArray: string[] = Array.from(res);

        return {
            followers_count: userFollowersSet.size,
            following_count: userFollowingSet.size,
            users_who_dont_follow_back_count: resAsArray.length,
            data: resAsArray,
        };
    }

    public async getUserData(): Promise<UserDetails> {
        this.throwErrorIfDidNotInitialize();

        return await this._instauto.navigateToUserAndGetData(
            this._instautoConfig.username,
        );
    }

    // Instauto methods
    public async safelyUnfollowUserList(
        usersToUnfollow: string[],
        limit: number,
        condition: (username: string) => boolean = () => true,
    ) {
        return await this._instauto.safelyUnfollowUserList(
            usersToUnfollow,
            limit,
            condition,
        );
    }

    public async safelyFollowUserList(
        users: string[],
        skipPrivate: boolean = false,
        limit: number,
    ) {
        return await this._instauto.safelyFollowUserList({
            users,
            skipPrivate,
            limit,
        });
    }

    public async sleep(timeInSeconds: number) {
        return await this._instauto.sleep(timeInSeconds * 1000);
    }

    public async followUser(username: string) {
        return await this._instauto.followUser(username);
    }

    public async unfollowUser(username: string) {
        return await this._instauto.unfollowUser(username);
    }

    // Puppeteer Methods
    public async close(): Promise<void> {
        this.throwErrorIfDidNotInitialize();
        if (this._browser) await this._browser.close();
    }

    // Initialization guard methods
    private throwErrorIfDidNotInitialize() {
        if (this._initCalled) return;
        throw new Error(
            "Initialization Error: init() method must be invoked before calling any other method",
        );
    }
}

export { IgBot, usersWhoDontWantToFollowBack };
