import * as _ from "lodash";
import { NextFunction, Request, Response } from "express";
import { CountryType } from "@Lib/types/backend/global/country-type";
import { ActionResultType } from "@Lib/types/core/action-result-type";
import { ProvinceType } from "@Lib/types/backend/global/province-type";
import { RequestCityType } from "@Lib/types/backend/global/request-city-type";
import { CityType } from "@Lib/types/backend/global/city-type";

/**
 * Country controller
 */
export default class CountryController {
    /**
     * Country/Index action
     * @param req Express.Request Request
     * @param res Express.Response Response
     * @param next Express.NextFunction next function
     */
    public async countries(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        let countries: Array<CountryType> = (await import(
            "@/mock/countries.json"
        )) as Array<CountryType>;

        countries = countries.map((x) => ({
            code: x.code,
            name: x.name,
        }));

        const result: ActionResultType = {
            success: true,
            data: countries,
        };

        res.send(result).end();
    }

    /**
     * Provinces/Index action
     * @param req Express.Request Request
     * @param res Express.Response Response
     * @param next Express.NextFunction next function
     */
    public async provinces(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const countryCode: string = req.body.countryCode;

        let countries: Array<CountryType> = (await import(
            "@/mock/countries.json"
        )) as Array<CountryType>;

        let country: CountryType = countries.find(
            (x) => x.code == countryCode
        ) as CountryType;

        const result: ActionResultType = {
            success: true,
            data: country.provinces,
        };

        res.send(result).end();
    }

    /**
     * Provinces/Index action
     * @param req Express.Request Request
     * @param res Express.Response Response
     * @param next Express.NextFunction next function
     */
    public async cities(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const province: RequestCityType = req.body as RequestCityType;
        let cities: Array<CityType> = [];
        const result: ActionResultType = {
            success: true,
            data: cities,
        };

        let countries: Array<CountryType> = (await import(
            "@/mock/countries.json"
        )) as Array<CountryType>;

        let country: CountryType = countries.find(
            (x) => x.code == province.countryCode
        ) as CountryType;

        if (country) {
            const provinceData: ProvinceType = country.provinces?.find(
                (x) => x.code == province.provinceCode
            ) as ProvinceType;

            if (province) {
                cities = provinceData.cities?.map((x) => ({
                    code: x.code,
                    name: x.name,
                }));
                result.data = cities || [];
            }
        }

        res.send(result).end();
    }
}
