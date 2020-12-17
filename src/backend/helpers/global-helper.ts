import RedisHelper from "./redis-helper";
import SmsCenter from "./sms-center";
import GeneratePassword from "./generate-password";
import LanguageHelper from "./language-helper";

/**
 * Global helper
 */
export default class GlobalHelper {
    public static __: LanguageHelper = new LanguageHelper("en");

    public static generatePassword?: GeneratePassword = undefined;

    public static redisHelper?: RedisHelper = undefined;
    public static smsCenter?: SmsCenter = undefined;
}
