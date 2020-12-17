import { UserRegisterType } from "@Lib/types/backend/auth/user-register-type";

/**
 * Redis otp data type
 */
export type OtpRegisterDataType = {
    token: string;
    activationCode: string;
    registered_at: Date;
    userRegisterData: UserRegisterType;
};
