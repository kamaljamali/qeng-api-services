import RedisHelper from "./redis-helper";
import SmsCenter from "./sms-center";

export default class GlobalHelper {
  public static redisHelper?: RedisHelper = undefined;
  public static smsCenter?: SmsCenter = undefined;
}
