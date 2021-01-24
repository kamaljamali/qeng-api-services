import { Types } from "mongoose";

/**
 * User Register data type
 */
export type singnInUserData = {
    userId: Types.ObjectId;
    firstName: string;
    lastName: string;
    nationalId: string;
    phoneNumber: string;
};
