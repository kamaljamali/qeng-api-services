import RedisHelper from "./redis-helper";
import SmsCenter from "./sms-center";
import GeneratePassword from "./generate-password-helper";
import LanguageHelper from "@BE/helpers/language-helper";
import EnLang from "@LANG/en.json";

/**
 * Global helper
 */
export default class GlobalHelper {
    public static langHelper: LanguageHelper = new LanguageHelper("en");
    public static generatePassword?: GeneratePassword = undefined;

    public static redisHelper?: RedisHelper = undefined;
    public static smsCenter?: SmsCenter = undefined;

    /**
     * Get key
     */
    public static __(key: string): string {
        return this.langHelper.__(key);
    }

    /**
     * EnKeys
     */
    public static get __Keys() {
        return EnLang;
    }
}
