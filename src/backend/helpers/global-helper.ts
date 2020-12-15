import RedisHelper from "./redis-helper";
import SmsCenter from "./sms-center";
import GeneratePassword from "./generate-password";

export default class GlobalHelper {
    public static redisHelper?: RedisHelper = undefined;
    public static generatePassword?: GeneratePassword = undefined;
    public static smsCenter?: SmsCenter = undefined;
}
