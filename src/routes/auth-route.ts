import AuthController from "@BE/Controllers/auth-controller";
import JwtMiddleware from "@BE/middlewares/jwt-middleware";
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
            [
                controller.requestOtpToken.bind(controller),
            ],
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
            [
                JwtMiddleware._instance.apply,
                controller.checkNationalId.bind(controller),
            ],
            "auth.check-national-id"
        );

        super.post(
            "/checkUserPhoneNumber",
            [
                JwtMiddleware._instance.apply,
                controller.checkPhoneNumber.bind(controller),
            ],
            "auth.check-phone-number"
        );

        super.post(
            "/newUserRegisterRequest",
            [controller.userRegisterRequest.bind(controller)],
            "auth.user-register-request"
        );

        super.post(
            "/confirmNewUserRegister",
            [controller.confirmUserRegistration.bind(controller)],
            "auth.confirm-user-registration"
        );

        super.post(
            "/checkUserActivationCodeRsesetPassword",
            [controller.checkResetPasswordActivationCode.bind(controller)],
            "auth.check-reset-password-activation-code"
        );

        super.post(
            "/checkUserActivationCodeRegister",
            [controller.checkRegisterActivationCode.bind(controller)],
            "auth.check-register-activation-code"
        );
    }
}
