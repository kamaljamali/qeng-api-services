import AuthController from "@BE/Controllers/auth-controller";
import BaseRouter from "@Core/Helpers/base-router-helper";

/**
 * Auth router
 */
export default class AuthRoute extends BaseRouter {
    /**
     * Constructor
     */
    constructor() {
        super("/auth", "AuthRoute");
        this.defineRoutes();
    }

    /**
     * Define routes
     */
    private defineRoutes(): void {
        const controller: AuthController = new AuthController();

        super.post(
            "/loginByUserData",
            [controller.loginByUserData.bind(controller)],
            "auth.login-by-user-data"
        );

        super.post(
            "/requestOtpToken",
            [controller.requestOtpToken.bind(controller)],
            "auth.request-otp-token"
        );

        super.post(
            "/loginByOtpToken",
            [controller.loginByOtpToken.bind(controller)],
            "auth.login-by-otp-token"
        );

        super.post(
            "/requestForgetPasswordToken",
            [controller.requestForgetPasswordToken.bind(controller)],
            "auth.request-forget-password-token"
        );

        super.post(
            "/resetPassword",
            [controller.resetPassword.bind(controller)],
            "auth.reset-password"
        );

        super.post(
            "/checkUserNationalId",
            [controller.checkUserNationalId.bind(controller)],
            "auth.check-user-national-id"
        );

        super.post(
            "/checkUserPhoneNumber",
            [controller.checkUserPhoneNumber.bind(controller)],
            "auth.check-user-phone-number"
        );

        super.post(
            "/newUserRegisterRequest",
            [controller.newUserRegisterRequest.bind(controller)],
            "auth.new-user-register-request"
        );

        super.post(
            "/confirmNewUserRegister",
            [controller.confirmNewUserRegister.bind(controller)],
            "auth.confirm-new-user-register"
        );

        super.post(
            "/checkUserActivationCodeRsesetPassword",
            [controller.checkUserActivationCodeResetPassword.bind(controller)],
            "auth.check-user-activation-code-reset-password"
        );

        super.post(
            "/checkUserActivationCodeRegister",
            [controller.checkUserActivationCodeRegister.bind(controller)],
            "auth.check-user-activation-code-register"
        );
    }
}
