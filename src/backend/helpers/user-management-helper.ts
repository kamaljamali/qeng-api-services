import { Model, Types } from "mongoose";
import { v4 as UUIDv4 } from "uuid";
import GlobalData from "@Core/Global/global-data";
import GlobalHelper from "./global-helper";
import { ActionResultType } from "@Lib/types/core/action-result-type";
import { UserLoginDataType } from "@Lib/types/frontend/auth/user-login-data-type";
import { UserLoginOtpType } from "@Lib/types/frontend/auth/user-login-otp-type";
import { IUserModel } from "@BE/models/user-model";
import { OtpResponseType } from "@Lib/types/frontend/auth/opt-response-type";
import { OtpDataType } from "@Lib/types/backend/redis/opt-data-type";
import { UserResetPasswordType } from "@Lib/types/frontend/auth/user-reset-password";
import { UserRegisterType } from "@Lib/types/frontend/auth/user-register-type";
import { OtpRegisterDataType } from "@Lib/types/backend/redis/opt-register-data-type";
import { OtpPrefixEnum } from "@Lib/enums/backend/opt-prefix-enum";
import GlobalMethods from "@Core/Global/global-methods";
import { SmsConfigType } from "@Lib/types/config/sms-config-type";
import Lang from "@LANG/fa";

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
            pwd: userData.password,
        });

        const result = {
            success: data != null,
            data:
                data != null
                    ? GlobalData.router.routerManager.route("home.index")
                    : Lang.INVALIDNATIONALIDORPASSWORD,
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
                `${Lang.OTP}:\n${otpResult.activationCode}`
            );

            result = {
                success: true,
                data: otpResult.token,
            };
        } else {
            result = {
                success: false,
                data: Lang.INVALIDNATIONALIDORPHONENUMBER,
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
        otpPerfix: OtpPrefixEnum = OtpPrefixEnum.NONE
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
            }
        }

        result = {
            success: loginSuccess,
            data: loginSuccess
                ? GlobalData.router.routerManager.route("home.index")
                : Lang.INVALIDOTP,
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
                    user.pwd = otpResponse.newPassword;
                    await user.save();

                    operationResult = true;
                }
            }
        }

        result = {
            success: operationResult,
            data: operationResult
                ? GlobalData.router.routerManager.route("auth.login")
                : Lang.INVALIDOTP,
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
                data: Lang.ALREADYREGISTERUSER,
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
                `${Lang.OTP}:\n${otpRegisterResult.activationCode}`
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
                const userData = {
                    name: otpData.userRegisterData.nationalId,
                    phone: otpData.userRegisterData.phoneNumber,
                    first_name: otpData.userRegisterData.firstName,
                    last_name: otpData.userRegisterData.lastName,
                    pwd: otpData.userRegisterData.phoneNumber,
                    activated_at: new Date(),
                };
                console.log(userData);
                /* Register new user */
                const User: Model<IUserModel> = GlobalData.dbEngine.model(
                    "User"
                );
                const newUser: IUserModel = await User.create(userData);

                /* TODO: GENERATE RESET TOKEN */
                // /* Issue reset password  */
                // const resetPassResult = await this.requestOtpToken(
                //   {
                //     nationalId: newUser.name,
                //     phoneNumber: newUser.phone,
                //   },
                //   OtpPrefixEnum.FORGET_PASSWORD,
                // );

                /* Setup result */
                result.success = true;
                result.data = `${Lang.SUCCESSFULLYREGISTER}<br/>${Lang.PASSWORDSENDTOPHONENUMBER}`;

                // result.data = resetPassResult.data;
            } else {
                result.data = Lang.INVALIDOTP;
            }
        } else {
            result.data = Lang.INVALIDOTP;
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
            data: data == null ? "" : Lang.ALREADYREGISTEREDNATIONALID,
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
                { phone_number: temp.phoneNumber },
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
            data: data == null ? "" : Lang.ALREADYREGISTEREDPHONENUMBER,
        };

        return result;
    }

    /**
     * Check user activation code reset password
     */
    public static async checkUserActivationCodeResetPassword(
        activationCodeData: OtpResponseType,
        optPerfix: string
    ): Promise<ActionResultType> {
        let result: ActionResultType;

        /* Store opt-request in redis-db */
        const redisData = await GlobalHelper.redisHelper?.runCmd(
            "get",
            `otp-request:${optPerfix}:${activationCodeData.token}`
        );

        let tokenSuccess: boolean = false;
        if (redisData) {
            const optData: OtpDataType = JSON.parse(redisData);

            if (optData.activationCode == activationCodeData.activationCode) {
                tokenSuccess = true;
            }
        }

        result = {
            success: tokenSuccess,
            data: tokenSuccess ? "" : Lang.INVALIDOTP,
        };

        return result;
    }

    /**
     * Check user activation code Register
     */
    public static async checkUserActivationCodeRegister(
        activationCodeData: OtpResponseType,
        optPerfix: string
    ): Promise<ActionResultType> {
        let result: ActionResultType;

        /* Store opt-request in redis-db */
        const redisData = await GlobalHelper.redisHelper?.runCmd(
            "get",
            `otp-request:${optPerfix}:${activationCodeData.token}`
        );

        let tokenSuccess: boolean = false;
        if (redisData) {
            const optData: OtpDataType = JSON.parse(redisData);

            if (optData.activationCode == activationCodeData.activationCode) {
                tokenSuccess = true;

                /* CREATE USER  */
            }
        }

        result = {
            success: tokenSuccess,
            data: tokenSuccess ? "" : Lang.INVALIDOTP,
        };

        return result;
    }

    /**
     * Generate activation code
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
}
