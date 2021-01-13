import {
    Document,
    Mongoose,
    Model,
    Schema,
    SchemaDefinition,
    SchemaOptions,
    SchemaTimestampsConfig,
    Types,
} from "mongoose";
import { yellow } from "chalk";
import IDBModel from "@Lib/interfaces/core/db-model-interface";
import GlobalData from "@Core/Global/global-data";
import GeneratePasswordHelper from "@BE/helpers/generate-password-helper";

/**
 * User model interface
 */
export interface IUserModel extends Document {
    name: string;
    pwd: string;
    phone: string;
    first_name: string;
    last_name: string;
    activated_at?: Date;
    created_by?: Types.ObjectId;

    changePwd(newPwd: string): Promise<any>;
}

/**
 * UserModel class
 */
export default class UserModel implements IDBModel {
    /**
     * Get model name
     */
    public getName(): string {
        return "User";
    }

    /**
     * Get database model name
     */
    public getDbName(): string | undefined {
        return "users";
    }

    /**
     *
     * @param dbEngine any DbEngine
     */
    public async setup(dbEngine: Mongoose): Promise<Model<IUserModel>> {
        /* Create model */
        const model: Model<IUserModel> = dbEngine.model<IUserModel>(
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
            name: {
                type: String,
                required: true,
                trim: true,
                unique: true,
                index: true,
            },

            pwd: {
                type: String,
                required: true,
            },

            first_name: {
                type: String,
                required: true,
            },

            last_name: {
                type: String,
                required: true,
            },

            phone: {
                type: String,
                required: true,
            },

            activated_at: {
                type: Date,
            },

            created_by: {
                type: Types.ObjectId,
            },
        };

        /* Define schmea */
        const schema: Schema = new Schema<IUserModel>(schemaDef, {
            timestamps: {
                createdAt: "created_at",
                updatedAt: "updated_at",
            } as SchemaTimestampsConfig,
        } as SchemaOptions);

        /* PreSchema */
        schema.pre("save", async function (next) {
            if (!this.isModified("pwd")) {
                return next();
            }

            const user: IUserModel = this as IUserModel;
            user.pwd = await GeneratePasswordHelper.encryptPassword(user.pwd);

            next();
        });

        /* Methods */
        schema.methods.changePwd = async function changePwd(
            newPwd: string
        ): Promise<any> {
            const doc: IUserModel = this as IUserModel;

            doc.pwd = newPwd;
            return doc.save();
        };

        /* Return schema */
        return schema;
    }
}
