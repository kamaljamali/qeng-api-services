import { NextFunction, Request, Response } from "express";
import { UserLoginDataType } from "@Lib/types/backend/auth/user-login-data-type";
import { UserRegisterType } from "@Lib/types/backend/auth/user-register-type";
import UserManagementHelper from "@BE/helpers/user-management-helper";
import { ActionResultType } from "@Lib/types/core/action-result-type";
import { UserLoginOtpType } from "@Lib/types/backend/auth/user-login-otp-type";
import { OtpResponseType } from "@Lib/types/backend/auth/opt-response-type";
import { UserResetPasswordType } from "@Lib/types/backend/auth/user-reset-password";
import { OtpPrefixEnum } from "@Lib/enums/backend/opt-prefix-enum";

/**
 * Auth controller
 */
export default class AuthController {
    /**
     * Auth/login-by-user-data action
     * @param req Express.Request Request
     * @param res Express.Response Response
     * @param next Express.NextFunction next function
     */
    public async loginByUserData(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const userData: UserLoginDataType = req.body as UserLoginDataType;

        const result: ActionResultType = await UserManagementHelper.loginByUserData(
            userData
        );

        res.status(200).send(result).end();
    }

    /**
     * Auth/request-otp-token action
     * @param req Express.Request Request
     * @param res Express.Response Response
     * @param next Express.NextFunction next function
     */
    public async requestOtpToken(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const requestData: UserLoginOtpType = req.body as UserLoginOtpType;

        const result: ActionResultType = await UserManagementHelper.requestOtpToken(
            requestData,
            OtpPrefixEnum.LOGIN
        );

        res.status(200).send(result).end();
    }

    /**
     * Auth/login-by-otp-token action
     * @param req Express.Request Request
     * @param res Express.Response Response
     * @param next Express.NextFunction next function
     */
    public async loginByOtpToken(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const otpResponse: OtpResponseType = req.body as OtpResponseType;

        const result: ActionResultType = await UserManagementHelper.loginByOtpToken(
            otpResponse,
            OtpPrefixEnum.LOGIN
        );

        res.status(200).send(result).end();
    }

    /**
     * Auth/request-forget-password-token action
     * @param req Express.Request Request
     * @param res Express.Response Response
     * @param next Express.NextFunction next function
     */
    public async requestForgetPasswordToken(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const userData: UserLoginOtpType = req.body as UserLoginOtpType;

        const result: ActionResultType = await UserManagementHelper.requestOtpToken(
            userData,
            OtpPrefixEnum.FORGET_PASSWORD
        );

        res.status(200).send(result).end();
    }

    /**
     * Auth/reset-password action
     * @param req Express.Request Request
     * @param res Express.Response Response
     * @param next Express.NextFunction next function
     */
    public async resetPassword(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const userData: UserResetPasswordType = req.body as UserResetPasswordType;
        const result: ActionResultType = await UserManagementHelper.resetPassword(
            userData,
            OtpPrefixEnum.FORGET_PASSWORD
        );

        res.status(200).send(result).end();
    }

    /**
     * Auth/check-user-national-id action
     * @param req Express.Request Request
     * @param res Express.Response Response
     * @param next Express.NextFunction next function
     */
    public async checkUserNationalId(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const nationalID: string = req.body as string;

        const result: ActionResultType = await UserManagementHelper.checkUserNationalId(
            nationalID
        );

        res.status(200).send(result).end();
    }

    /**
     * Auth/check-user-phone-number action
     * @param req Express.Request Request
     * @param res Express.Response Response
     * @param next Express.NextFunction next function
     */
    public async checkUserPhoneNumber(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const phoneNumber: string = req.body as string;

        const result: ActionResultType = await UserManagementHelper.checkUserPhoneNumber(
            phoneNumber
        );

        res.status(200).send(result).end();
    }

    /**
     * Auth/new-user-register-request action
     * @param req Express.Request Request
     * @param res Express.Response Response
     * @param next Express.NextFunction next function
     */
    public async newUserRegisterRequest(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        let userData: UserRegisterType = req.body as UserRegisterType;
        userData = JSON.parse(JSON.stringify(userData)) as UserRegisterType;

        /* Check nationalId */
        const flagNID: ActionResultType = await UserManagementHelper.checkUserNationalId(
            userData.nationalId
        );

        if (!flagNID.success) {
            res.status(200).send(flagNID).end();
        } else {
            /* Check Phone Number */
            const flagPhone: ActionResultType = await UserManagementHelper.checkUserPhoneNumber(
                userData.phoneNumber
            );

            if (!flagPhone.success) {
                res.status(200).send(flagPhone).end();
            } else {
                const result: ActionResultType = await UserManagementHelper.requestOtpTokenRegister(
                    userData,
                    OtpPrefixEnum.REGISTER
                );

                res.status(200).send(result).end();
            }
        }
    }

    /**
     * Auth/confirm-new-user-register action
     * @param req Express.Request Request
     * @param res Express.Response Response
     * @param next Express.NextFunction next function
     */
    public async confirmNewUserRegister(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const userData: OtpResponseType = req.body as OtpResponseType;

        const result: ActionResultType = await UserManagementHelper.confirmNewUserRegister(
            userData,
            OtpPrefixEnum.REGISTER
        );

        res.status(200).send(result).end();
    }

    /**
     * Auth/check-user-activation-code-reset-password
     * @param req Express.Request Request
     * @param res Express.Response Response
     * @param next Express.NextFunction next function
     */
    public async checkUserActivationCodeResetPassword(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const activationCodeData: OtpResponseType = req.body as OtpResponseType;

        const result: ActionResultType = await UserManagementHelper.checkUserActivationCodeResetPassword(
            activationCodeData,
            OtpPrefixEnum.FORGET_PASSWORD
        );

        res.status(200).send(result).end();
    }

    /**
     * Auth/check-user-activation-code-Register
     * @param req Express.Request Request
     * @param res Express.Response Response
     * @param next Express.NextFunction next function
     */
    public async checkUserActivationCodeRegister(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const activationCodeData: OtpResponseType = req.body as OtpResponseType;

        const result: ActionResultType = await UserManagementHelper.checkUserActivationCodeRegister(
            activationCodeData,
            OtpPrefixEnum.REGISTER
        );

        res.status(200).send(result).end();
    }
}
