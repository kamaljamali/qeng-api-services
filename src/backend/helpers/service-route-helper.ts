const LOG_BASE: string = "http://lab.qeng.ir/services/logger";
const EWALLET_BASE: string = "http://lab.qeng.ir/services/ewallet/ewallet";

export const Routes = {
    /* logger */
    tag: "membership-service",
    "logger.info": `${LOG_BASE}/log/info`,
    "logger.error": `${LOG_BASE}/log/error`,
    "logger.warning": `${LOG_BASE}/log/warning`,
    "logger.debug": `${LOG_BASE}/log/debug`,
    "logger.silly": `${LOG_BASE}/log/silly`,
    /* e-wallet */
    "ewallet.create": `${EWALLET_BASE}/`,
};
