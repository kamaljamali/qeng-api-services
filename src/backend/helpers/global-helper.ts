import RedisHelper from "./redis-helper";
import SmsCenter from "./sms-center";
import GeneratePassword from "./generate-password-helper";
import LanguageHelper from "@BE/helpers/language-helper";
import JwtHelper from "./jwt-helper";

/**
 * Global helper
 */
export default class GlobalHelper {
    public static langHelper: LanguageHelper = new LanguageHelper("fa");
    public static generatePassword?: GeneratePassword = undefined;

    public static redisHelper?: RedisHelper = undefined;
    public static smsCenter?: SmsCenter = undefined;
    public static jwtHelper?: JwtHelper = undefined;

    /**
     * Get key
     */
    public static __(key: string, lang: string = "fa"): string {
        return this.langHelper.__(key, lang);
    }
}
