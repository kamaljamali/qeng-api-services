/**
 * User login history type
 */
export type UserLoginHistoryType = {
    token: string;
    activationCode: string;
    registered_at: Date;
    userId: any;
    type: string;
    status: boolean;
};
