import * as _ from "lodash";
import { readFileSync } from "fs";
import { v4 as uuidV4 } from "uuid";
import * as JWT from "jsonwebtoken";
import GlobalMethods from "@Core/Global/global-methods";

/**
 * JWT helper
 */
export default class JwtHelper {
    /* Consts */
    private get jwtConfig(): JWT.SignOptions {
        return {
            algorithm: "RS512",
            expiresIn: "1440m",
            jwtid: uuidV4(),
        } as JWT.SignOptions;
    }

    private privateKey: string = readFileSync(
        GlobalMethods.rPath("private/ssl/server-key.pem"),
        "utf-8"
    );
    private publicKey: string = readFileSync(
        GlobalMethods.rPath("private/ssl/server-cert.pem"),
        "utf-8"
    );

    /**
     * Sign
     * @param payload
     */
    public async sign(
        payload: any,
        userConfig: JWT.SignOptions = {}
    ): Promise<string> {
        let options: JWT.SignOptions = _.merge(this.jwtConfig, userConfig);
        const jwtToken: string = JWT.sign(payload, this.privateKey, options);

        return jwtToken;
    }

    /**
     * Verify
     * @param payload
     */
    public async verify(
        token: string,
        userConfig: JWT.SignOptions = {}
    ): Promise<any> {
        let options: JWT.SignOptions = _.merge(this.jwtConfig, userConfig);

        const jwtToken: any = JWT.verify(token, this.publicKey);
        return jwtToken;
    }
}
