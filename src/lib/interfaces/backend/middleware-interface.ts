import { Request, Response, NextFunction } from "express";

/**
 * Middleware interface
 */
export default interface IMiddleware {
    apply(req: Request, res: Response, next: NextFunction): Promise<void>;
}
