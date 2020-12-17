import { Model, Types } from "mongoose";
import { v4 as UUIDv4 } from "uuid";
import GlobalData from "@Core/Global/global-data";
import GlobalHelper from "./global-helper";
import { ActionResultType } from "@Lib/types/core/action-result-type";
import { UserLoginDataType } from "@Lib/types/backend/auth/user-login-data-type";
import { UserLoginOtpType } from "@Lib/types/backend/auth/user-login-otp-type";
import { IUserModel } from "@BE/models/user-model";
import { OtpResponseType } from "@Lib/types/backend/auth/opt-response-type";
import { OtpDataType } from "@Lib/types/backend/redis/opt-data-type";
import { UserResetPasswordType } from "@Lib/types/backend/auth/user-reset-password";
import { UserRegisterType } from "@Lib/types/backend/auth/user-register-type";
import { OtpRegisterDataType } from "@Lib/types/backend/redis/opt-register-data-type";
import { OtpPrefixEnum } from "@Lib/enums/backend/opt-prefix-enum";
import GlobalMethods from "@Core/Global/global-methods";
import { SmsConfigType } from "@Lib/types/config/sms-config-type";
<<<<<<< HEAD
import Lang from "@LANG/fa.json";
=======
import FA from "@LANG/fa";
import { ILoginHistoryModel } from "@BE/models/user-login-history-model";
>>>>>>> main

/**
 * UserManagement Helper class
 */
export default class UserManagementHelper {
    /**
     * Login by user data
     */
    public static async loginByUserData(
        userData: UserLoginDataType
    ): Promise<ActionResultType> {
        /* Validaion / TODO */

        /* Check database */
        const UserModel: Model<IUserModel> = GlobalData.dbEngine.model("User");
        const data = await UserModel.findOne({
            name: userData.nationalId,
            pwd: await this.encryptPassword(userData.password),
        });

        if (null != data) {
            this.saveHistoryUserDataLogin(data, "userdata", true);
        }

        const result = {
            success: data != null,
            data:
                data != null
                    ? GlobalData.router.routerManager.route("home.index")
                    : FA.INVALID_NATIONALID_OR_PASSWORD,
        };

        return result;
    }

    /**
     * Request OTP token
     */
    public static async requestOtpToken(
        requestData: UserLoginOtpType,
        otpPerfix: OtpPrefixEnum = OtpPrefixEnum.NONE
    ): Promise<ActionResultType> {
        /* Validaion / TODO */

        /* Check database */
        const UserModel: Model<IUserModel> = GlobalData.dbEngine.model("User");
        const user = await UserModel.findOne({
            name: requestData.nationalId,
            phone: requestData.phoneNumber,
        });

        let result;

        if (user) {
            const activationCode: string = await this.generateActivationCode();

            /* Generate token data */
            const otpResult: OtpDataType = {
                token: UUIDv4(),
                activationCode: activationCode,
                registered_at: new Date(),
                userId: user._id,
            };

            /* Store otp-request in redis-db */
            await GlobalHelper.redisHelper?.runCmd(
                "set",
                `otp-request:${otpPerfix}:${otpResult.token}`,
                JSON.stringify(otpResult)
            );

            /* Send activation code to user */
            GlobalHelper.smsCenter?.sendSms(
                user.phone,
                `${FA.OTP}:\n${otpResult.activationCode}`
            );

            result = {
                success: true,
                data: otpResult.token,
            };
        } else {
            result = {
                success: false,
                data: FA.INVALID_NATIONALID_OR_PHONE_NUMBER,
            };
        }

        return result;
    }

    /**
     *
     * @param otpResponse OtpResponseType OTP Response data
     */
    public static async loginByOtpToken(
        otpResponse: OtpResponseType,
        otpPerfix: OtpPrefixEnum = OtpPrefixEnum.LOGIN
    ): Promise<ActionResultType> {
        let result: ActionResultType;

        /* Store otp-request in redis-db */
        const redisData = await GlobalHelper.redisHelper?.runCmd(
            "get",
            `otp-request:${otpPerfix}:${otpResponse.token}`
        );

        let loginSuccess: boolean = false;

        if (redisData) {
            const optData: OtpDataType = JSON.parse(redisData);
            if (optData.activationCode == otpResponse.activationCode) {
                loginSuccess = true;

                /* Delete otp-request from redis-db */
                const delRedisData = await GlobalHelper.redisHelper?.runCmd(
                    "del",
                    `otp-request:${otpPerfix}:${otpResponse.token}`
                );
            }
            /**********save history data in db********* */
            this.saveHistoryOtpLogin(optData, "otp", loginSuccess);
        }

        result = {
            success: loginSuccess,
            data: loginSuccess
                ? GlobalData.router.routerManager.route("home.index")
                : FA.INVALID_OTP,
        };

        return result;
    }

    /**
     * Reset user password
     * @param otpResponse OtpResponseType OTP Response data
     */
    public static async resetPassword(
        otpResponse: UserResetPasswordType,
        otpPerfix: OtpPrefixEnum = OtpPrefixEnum.NONE
    ): Promise<ActionResultType> {
        let result: ActionResultType;

        /* Store otp-request in redis-db */
        const redisData = await GlobalHelper.redisHelper?.runCmd(
            "get",
            `otp-request:${otpPerfix}:${otpResponse.token}`
        );

        let operationResult: boolean = false;

        if (redisData) {
            const optData: OtpDataType = JSON.parse(redisData);

            if (optData.activationCode == otpResponse.activationCode) {
                /* 1- Find the user */
                const UserModel: Model<IUserModel> = GlobalData.dbEngine.model(
                    "User"
                );
                const user = await UserModel.findOne({
                    _id: Types.ObjectId(optData.userId),
                });

                if (user) {
                    user.pwd = await this.encryptPassword(
                        otpResponse.newPassword
                    );
                    await user.save();

                    operationResult = true;

                    /* Delete otp-request from redis-db */
                    const delRedisData = await GlobalHelper.redisHelper?.runCmd(
                        "del",
                        `otp-request:${otpPerfix}:${otpResponse.token}`
                    );
                }
            }
        }

        result = {
            success: operationResult,
            data: operationResult
                ? GlobalData.router.routerManager.route("auth.login")
                : FA.INVALID_OTP,
        };

        return result;
    }

    /**
     * Request OTP token register
     */
    public static async requestOtpTokenRegister(
        newUserData: UserRegisterType,
        otpPerfix: OtpPrefixEnum = OtpPrefixEnum.NONE
    ): Promise<ActionResultType> {
        /* Validaion / TODO */

        /* Check database */
        const UserModel: Model<IUserModel> = GlobalData.dbEngine.model("User");
        const user = await UserModel.findOne({
            name: newUserData.nationalId,
            phone: newUserData.phoneNumber,
        });

        let result;

        if (user) {
            result = {
                success: false,
                data: FA.ALREADY_REGISTER_USER,
            };
        } else {
            const activationCode: string = await this.generateActivationCode();

            /* Generate token data */
            const otpRegisterResult: OtpRegisterDataType = {
                token: UUIDv4(),
                activationCode: activationCode,
                registered_at: new Date(),
                userRegisterData: newUserData,
            };

            /* Store otp-request in redis-db */
            await GlobalHelper.redisHelper?.runCmd(
                "set",
                `otp-request:${otpPerfix}:${otpRegisterResult.token}`,
                JSON.stringify(otpRegisterResult)
            );

            /* Send activation code to user */
            GlobalHelper.smsCenter?.sendSms(
                otpRegisterResult.userRegisterData.phoneNumber,
                `${FA.OTP}:\n${otpRegisterResult.activationCode}`
            );

            result = {
                success: true,
                data: otpRegisterResult.token,
            };
        }
        return result;
    }

    /**
     *
     * Confirm new user register
     */
    public static async confirmNewUserRegister(
        otpResponse: OtpResponseType,
        otpPerfix: OtpPrefixEnum = OtpPrefixEnum.NONE
    ): Promise<ActionResultType> {
        let result: ActionResultType = {
            success: false,
            data: null,
        };

        /* Fetch otp-request from redis-db */
        const redisData = await GlobalHelper.redisHelper?.runCmd(
            "get",
            `otp-request:${otpPerfix}:${otpResponse.token}`
        );

        if (redisData) {
            const otpData: OtpRegisterDataType = JSON.parse(redisData);

            if (otpData.activationCode == otpResponse.activationCode) {
                /* Generate password */
                let password: string = await GlobalHelper.generatePassword?.generatePassword();
                console.log(password);

                const userData = {
                    name: otpData.userRegisterData.nationalId,
                    phone: otpData.userRegisterData.phoneNumber,
                    first_name: otpData.userRegisterData.firstName,
                    last_name: otpData.userRegisterData.lastName,
                    pwd: await this.encryptPassword(password),
                    activated_at: new Date(),
                };

                /* Register new user */
                const User: Model<IUserModel> = GlobalData.dbEngine.model(
                    "User"
                );
                await User.create(userData);

                /* Delete otp-request from redis-db */
                await GlobalHelper.redisHelper?.runCmd(
                    "del",
                    `otp-request:${otpPerfix}:${otpResponse.token}`
                );

                /* Send activation code to user */
                GlobalHelper.smsCenter?.sendSms(
                    userData.phone,
                    `${FA.YOUR_PASSWORD_IS}:\n${password}`
                );

                /* Setup result */
                result.success = true;
                result.data = `${FA.SUCCESS_FULLY_REGISTER}<br/>${FA.PASSWORD_SEND_TO_PHONE_NUMBER}`;

                // result.data = resetPassResult.data;
            } else {
                result.data = FA.INVALID_OTP;
            }
        } else {
            result.data = FA.INVALID_OTP;
        }

        return result;
    }

    /**
     * Check user national id
     */
    public static async checkUserNationalId(
        nationalId: string
    ): Promise<ActionResultType> {
        /* Validaion / TODO */

        /* Check database */
        const UserModel: Model<IUserModel> = GlobalData.dbEngine.model("User");
        const temp = JSON.parse(JSON.stringify(nationalId));

        const query = {
            name: temp.nationalID || temp,
        };

        const data = await UserModel.findOne(query);

        const result = {
            success: data == null,
            data: data == null ? "" : FA.ALREADY_REGISTERED_NATIONALID,
        };

        return result;
    }

    /**
     * Check user phone number
     */
    public static async checkUserPhoneNumber(
        phoneNumber: string
    ): Promise<ActionResultType> {
        /* Validaion / TODO */

        /* Check database */
        const UserModel: Model<IUserModel> = GlobalData.dbEngine.model("User");

        const temp = JSON.parse(JSON.stringify(phoneNumber));

        const query = {
            $or: [
                { phone_number: temp.phoneNumber || phoneNumber },
                { phone_number: "+98" + temp.phoneNumber || phoneNumber },
                {
                    phone_number:
                        "+98" + (temp.phoneNumber || phoneNumber).substring(1),
                },
            ],
        };

        const data = await UserModel.findOne(query);

        const result = {
            success: data == null,
            data: data == null ? "" : FA.ALREADY_REGISTERED_PHONE_NUMBER,
        };

        return result;
    }

    /**
     * Check user activation code reset password
     */
    public static async checkUserActivationCodeResetPassword(
        activationCodeData: OtpResponseType,
        otpPerfix: string
    ): Promise<ActionResultType> {
        let result: ActionResultType;

        /* Store opt-request in redis-db */
        const redisData = await GlobalHelper.redisHelper?.runCmd(
            "get",
            `otp-request:${otpPerfix}:${activationCodeData.token}`
        );

        let tokenSuccess: boolean = false;
        if (redisData) {
            const optData: OtpDataType = JSON.parse(redisData);

            if (optData.activationCode == activationCodeData.activationCode) {
                tokenSuccess = true;

                /* Delete otp-request from redis-db */
                const delRedisData = await GlobalHelper.redisHelper?.runCmd(
                    "del",
                    `otp-request:${otpPerfix}:${activationCodeData.token}`
                );
            }
        }

        result = {
            success: tokenSuccess,
            data: tokenSuccess ? "" : FA.INVALID_OTP,
        };

        return result;
    }

    /**
     * Check user activation code Register
     * @param activationCodeData
     * @param otpPerfix
     */
    public static async checkUserActivationCodeRegister(
        activationCodeData: OtpResponseType,
        otpPerfix: string
    ): Promise<ActionResultType> {
        let result: ActionResultType;

        /* Store opt-request in redis-db */
        const redisData = await GlobalHelper.redisHelper?.runCmd(
            "get",
            `otp-request:${otpPerfix}:${activationCodeData.token}`
        );

        let tokenSuccess: boolean = false;
        if (redisData) {
            const optData: OtpDataType = JSON.parse(redisData);

            if (optData.activationCode == activationCodeData.activationCode) {
                tokenSuccess = true;

                /* Delete otp-request from redis-db */
                const delRedisData = await GlobalHelper.redisHelper?.runCmd(
                    "del",
                    `otp-request:${otpPerfix}:${activationCodeData.token}`
                );
            }
        }

        result = {
            success: tokenSuccess,
            data: tokenSuccess ? "" : FA.INVALID_OTP,
        };

        return result;
    }

    /**
     * Generate activation code
     * @param digits
     */
    public static async generateActivationCode(
        digits: number = 6
    ): Promise<string> {
        const smsConfig = await GlobalMethods.config<SmsConfigType>(
            "backend/sms"
        );

        if (!smsConfig.sendSms) {
            return "111111";
        }

        let start = parseInt("1" + Array(digits).fill("0").join(""));

        return Math.floor(Math.random() * start).toString();
    }

    /**
     * save data in history login
     */
    public static async saveHistoryOtpLogin(
        payload: OtpDataType,
        type: string,
        status: boolean
    ): Promise<void> {
        /* Set Result in History */
        let historyData = {
            token: payload.token,
            activation_code: payload.activationCode,
            registered_at: payload.registered_at,
            user_id: payload.userId,
            type: type,
            status: status,
        };

        /* Register new user */
        const LoginHistory: Model<ILoginHistoryModel> = GlobalData.dbEngine.model(
            "LoginHistory"
        );

        const newLoginHistory: ILoginHistoryModel = await LoginHistory.create(
            historyData
        );
    }

    /**
     * save data in history by user data login
     */
    public static async saveHistoryUserDataLogin(
        data: any,
        type: string,
        status: boolean
    ): Promise<void> {
        /* Set Result in History */
        let historyData = {
            token: "Nan",
            activation_code: "Nan",
            registered_at: new Date(),
            user_id: data._id,
            type: type,
            status: status,
        };

        /* Register new user */
        const LoginHistory: Model<ILoginHistoryModel> = GlobalData.dbEngine.model(
            "LoginHistory"
        );

        const newLoginHistory: ILoginHistoryModel = await LoginHistory.create(
            historyData
        );
    }

    /**
     * save data in history by user data login
     */
    public static async encryptPassword(password: string): Promise<string> {
        const crypto = require("crypto");

        let mykey = crypto.createCipher("aes-128-cbc", password);
        let mystr = mykey.update("abc", "utf8", "hex");
        mystr += mykey.final("hex");

        return mystr;
    }
}
