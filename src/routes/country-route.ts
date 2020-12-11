import CountryController from "@BE/Controllers/country-controller";
import BaseRouter from "@Core/Helpers/base-router-helper";

/**
 * Country router
 */
export default class CountryRoute extends BaseRouter {
  private CountryController: CountryController = new CountryController();

  /**
   * Constructor
   */
  constructor() {
    super("/countires", "CountryRoute");
    this.defineRoutes();
  }

  /**
   * Define routes
   */
  private defineRoutes(): void {
    super.get("/", [this.CountryController.countries], "country.countries");
    super.post("/provinces", [this.CountryController.provinces], "country.provinces");
    super.post("/cities", [this.CountryController.cities], "country.cities");
  }
}
