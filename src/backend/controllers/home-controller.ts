import ISessionDataModel from "@BE/data-model/session-data-model";
import AuthHelper from "@BE/helpers/auth-helper";
import GlobalData from "@Core/Global/global-data";
import { NextFunction, Request, Response } from "express";

/**
 * Home controller
 */
export default class HomeController {
  /**
   * Home/Index action
   * @param req Express.Request Request
   * @param res Express.Response Response
   * @param next Express.NextFunction next function
   */
  public async index(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    res.render("home.pug", { message: "Your are logged in", loggedIn: true });
  }

  /**
   * Home/Login action
   * @param req Express.Request Request
   * @param res Express.Response Response
   * @param next Express.NextFunction next function
   */
  public async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const sessionData: ISessionDataModel = {
      loginAt: new Date(),
      name: "Ojvar",
    } as ISessionDataModel;
    await AuthHelper.register(req, sessionData);

    const path = await GlobalData.router.routerManager.route("home.index");
    return res.redirect(path);
  }

  /**
   * Home/logout action
   * @param req Express.Request Request
   * @param res Express.Response Response
   * @param next Express.NextFunction next function
   */
  public async logout(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    await AuthHelper.logout(req);

    const path = await GlobalData.router.routerManager.route("home.index");
    return res.redirect(path);
  }
}
