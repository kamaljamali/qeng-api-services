import { GeneratePasswordConfigType } from "@Lib/types/config/generate-password-config-type";
import GlobalMethods from "@Core/Global/global-methods";
const PWDGenerator = require("generate-password");

/**
 * Generate Password Helper class
 */
export default class GeneratePasswordHelper {
    private _config: GeneratePasswordConfigType = {} as GeneratePasswordConfigType;
    /**
     * Constructor
     */
    constructor() {
        this.loadConfigs();
    }

    /**
     * Load configs
     */
    private async loadConfigs(): Promise<void> {
        this._config = await GlobalMethods.config<GeneratePasswordConfigType>(
            "backend/generate-password"
        );
    }

    /**
     * generate Password
     */
    public async generatePassword(): Promise<any> {
        const password: string = PWDGenerator.generate(this._config);

        return password;
    }
}
