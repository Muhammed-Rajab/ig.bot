import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import checkIfEnvFileIsPresent from "../logic/checkIfEnvFileIsPresent.js";

class Settings {
    static instance: Settings;

    BASE_PATH: string;
    COOKIES_PATH: string;
    BOT_DATA_PATH: string;
    ENV_FILE_PATH: string;

    private constructor() {
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        this.BASE_PATH = path.join(__dirname, "../../");
        this.BOT_DATA_PATH = path.join(this.BASE_PATH, "bot_data/");
        this.ENV_FILE_PATH = path.join(this.BASE_PATH, "config.env");
        this.COOKIES_PATH = path.join(this.BASE_PATH, "bot_data/cookies.json");
    }

    static getInstance(): Settings {
        if (!Settings.instance) {
            Settings.instance = new Settings();
        }
        return Settings.instance;
    }
}

const settings = Settings.getInstance();

// Check if env files is present
await checkIfEnvFileIsPresent(settings.ENV_FILE_PATH);

// Loading Environment Variables
dotenv.config({ path: settings.ENV_FILE_PATH });

export default settings;
