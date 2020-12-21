import {
    Document,
    Model,
    Mongoose,
    Schema,
    SchemaDefinition,
    SchemaOptions,
    SchemaTimestampsConfig,
    Types,
} from "mongoose";
import { yellow } from "chalk";
import IDBModel from "@Lib/interfaces/core/db-model-interface";
import GlobalData from "@Core/Global/global-data";

/**
 * LoginHistory model interface
 */
export interface ILoginHistoryModel extends Document {
    token: string;
    activation_code: string;
    registered_at: Date;
    user_id: Types.ObjectId;
    type: string;
    status: boolean;
}

/**
 * LoginHistoryModel class
 */
export default class LoginHistoryModel implements IDBModel {
    /**
     * Get model name
     */
    public getName(): string {
        return "LoginHistory";
    }

    /**
     * Get database model name
     */
    public getDbName(): string | undefined {
        return "login_history";
    }

    /**
     *
     * @param dbEngine any DbEngine
     */
    public async setup(dbEngine: Mongoose): Promise<Model<ILoginHistoryModel>> {
        /* Create model */
        const model: Model<ILoginHistoryModel> = dbEngine.model<ILoginHistoryModel>(
            this.getName(),
            this.getSchema(),
            this.getDbName()
        );

        /* Log */
        GlobalData.logger.info(
            `Model ${yellow(this.getName())} loaded successfully`
        );

        return model;
    }

    /**
     * Get model schema
     */
    public getSchema(): Schema {
        const schemaDef: SchemaDefinition = {
            token: {
                type: String,
                required: true,
            },
            activation_code: {
                type: String,
                required: true,
            },
            user_id: {
                type: Object,
                required: true,
            },
            status: {
                type: Boolean,
                required: true,
            },
            type: {
                type: String,
                required: true,
            },
            registered_at: {
                type: Date,
                required: true,
            },
        };

        /* Define schmea */
        const schema: Schema = new Schema(schemaDef, {
            timestamps: {
                createdAt: "created_at",
                updatedAt: "updated_at",
            } as SchemaTimestampsConfig,
        } as SchemaOptions);

        /* Return schema */
        return schema;
    }
}
