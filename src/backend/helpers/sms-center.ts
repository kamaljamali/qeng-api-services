import GlobalData from "@Core/Global/global-data";
import GlobalMethods from "@Core/Global/global-methods";
import { SmsConfigType } from "@Lib/types/config/sms-config-type";
import { AxiosResponse } from "axios";
import AxiosModule from "@BE/helpers/axios-module";

export default class SmsCenter {
    /**
     * Send sms flag
     */
    private _config: SmsConfigType = {} as SmsConfigType;

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
        this._config = await GlobalMethods.config<SmsConfigType>("backend/sms");
    }

    /**
     * Send sms
     * @param string
     * @param to
     * @param string
     * @param message
     */
    public async sendSms(
        target: string,
        message: string,
        sendDate?: number,
        checkingIds?: string
    ): Promise<any> {
        // const data = {
        //     message,
        //     sender: this._config.number,
        //     Receptor: target,
        //     senddate: sendDate,
        //     checkingids: checkingIds,
        // };
        const data = {
            to: target,
            body: message,
        };

        // const axiosHeaders: AxiosRequestConfig = {
        //     headers: this._config.headers,
        // };

        try {
            if (this._config.sendSms) {
                return await AxiosModule.post(this._config.url, data);
            }
        } catch (err) {
            GlobalData.logger.error(err);

            return null;
        }
    }
}
