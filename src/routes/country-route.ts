import CountryController from "@BE/Controllers/country-controller";
import BaseRouter from "@Core/Helpers/base-router-helper";

/**
 * Country router
 */
export default class CountryRoute extends BaseRouter {
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
        const controller: CountryController = new CountryController();

        super.get(
            "/",
            [controller.countries.bind(controller)],
            "country.countries"
        );

        super.post(
            "/provinces",
            [controller.provinces.bind(controller)],
            "country.provinces"
        );

        super.post(
            "/cities",
            [controller.cities.bind(controller)],
            "country.cities"
        );
    }
}
