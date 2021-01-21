import { Request, Response, NextFunction } from "express";
import GlobalHelper from "@BE/helpers/global-helper";
import IMiddleware from "@Lib/interfaces/backend/middleware-interface";

/**
 * JwtMiddleware class
 */
export default class JwtMiddleware implements IMiddleware {
    public static _instance: JwtMiddleware = new JwtMiddleware();

    /**
     * Apply middleware
     * @param req
     * @param res
     * @param next
     */
    public async apply(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        let jwtToken: any;
        
        try {
            const token: string = req.headers["jwt-token"] as string;
            jwtToken = await GlobalHelper.jwtHelper?.verify(token);
        } catch (err) {}

        if (jwtToken == null) {
            res.sendStatus(404);
        } else {
            (req as any).auth = jwtToken;

            next();
        }
    }
}
