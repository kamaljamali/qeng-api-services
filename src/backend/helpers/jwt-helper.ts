import * as _ from "lodash";
import { readFileSync } from "fs";
import { v4 as uuidV4 } from "uuid";
import * as JWT from "jsonwebtoken";
import GlobalMethods from "@Core/Global/global-methods";

const C_TEMP_KEY: string = "SECRET_KEY_$$";

/**
 * JWT helper
 */
export default class JwtHelper {
    /* Consts */
    private get jwtConfig(): JWT.SignOptions {
        return {
            algorithm: "RS512",
            expiresIn: "30m",
            jwtid: uuidV4(),
        } as JWT.SignOptions;
    }

    // private privateKey: string = readFileSync(
    //     GlobalMethods.rPath("private/ssl/server-key.pem"),
    //     "utf-8"
    // );
    // private publicKey: string = readFileSync(
    //     GlobalMethods.rPath("private/ssl/server-cert.pem"),
    //     "utf-8"
    // );

    /**
     * Sign
     * @param payload
     */
    public async sign(
        payload: any,
        userConfig: JWT.SignOptions = {}
    ): Promise<string> {
        // let options: JWT.SignOptions = _.merge(this.jwtConfig, userConfig);
        // const jwtToken: string = JWT.sign(payload, this.privateKey, options);
        const jwtToken: string = JWT.sign(payload, C_TEMP_KEY);

        return jwtToken;
    }

    /**
     * Verify
     * @param token
     */
    public async verify(
        token: string,
        userConfig: JWT.SignOptions = {}
    ): Promise<any> {
        // const jwtToken: any = JWT.verify(token, this.publicKey);
        const jwtToken: any = JWT.verify(token, C_TEMP_KEY);

        return jwtToken;
    }
}
