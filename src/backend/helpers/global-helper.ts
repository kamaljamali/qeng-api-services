import RedisHelper from "./redis-helper";
import SmsCenter from "./sms-center";
import GeneratePassword from "./generate-password-helper";
import LanguageHelper from "@BE/helpers/language-helper";
import IHash from "@Lib/interfaces/hash-interface";

/**
 * Global helper
 */
export default class GlobalHelper {
    public static langHelper: LanguageHelper = new LanguageHelper("fa");
    public static generatePassword?: GeneratePassword = undefined;

    public static redisHelper?: RedisHelper = undefined;
    public static smsCenter?: SmsCenter = undefined;

    /**
     * Get key
     */
    public static __(key: string, lang: string = "fa"): string {
        return this.langHelper.__(key, lang);
    }
}
