import { CityType } from "./city-type";

/**
 * Province type
 */
export type ProvinceType = {
    code: string;
    name: string;
    cities: Array<CityType>;
};
