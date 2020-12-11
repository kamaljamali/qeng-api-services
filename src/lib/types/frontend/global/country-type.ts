import { ProvinceType } from "./province-type";

/**
 * Country type
 */
export type CountryType = {
  code: string;
  name: string;
  provinces?: Array<ProvinceType>;
};
