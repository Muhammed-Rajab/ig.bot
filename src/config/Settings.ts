import path from "path";
import { fileURLToPath } from "url";

class Settings {
    static instance: Settings;

    BASE_PATH: string;
    COOKIES_PATH: string;

    private constructor() {
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        this.BASE_PATH = path.join(__dirname, "../../");
        this.COOKIES_PATH = path.join(this.BASE_PATH, "bot_data/cookies.json");
    }

    static getInstance(): Settings {
        if (!Settings.instance) {
            Settings.instance = new Settings();
        }
        return Settings.instance;
    }
}

export default Settings.getInstance();
