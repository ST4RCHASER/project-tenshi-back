import { LogLevel } from "./types/LogLevel";
import { LogType } from "./types/LogType";
export class Logger {
    constructor() {
        return this;
    }
    public raw(log_level: LogLevel, log_type: LogType, message: string) {
        let msg = `${log_level}${log_type} ${message}`;
        if (typeof msg === undefined) return;
        let today = new Date();
        let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let dateTime = date + ' ' + time;
        switch (log_level) {
            case LogLevel.ERROR:
                console.error(`|${dateTime}|`,msg);
                break;
            case LogLevel.WARN:
                console.warn(`|${dateTime}|`,msg);
                break;
            case LogLevel.DEBUG:
                console.debug(`|${dateTime}|`,msg);
                break;
            default:
                console.log(`|${dateTime}|`,msg)
        }
    }
    public info(message: string, type: LogType = LogType.RAW) {
        this.raw(LogLevel.INFO, type, message);
    }
    public warn(message: string, type: LogType = LogType.RAW) {
        this.raw(LogLevel.WARN, type, message);
    }
    public error(message: string, type: LogType = LogType.RAW) {
        this.raw(LogLevel.ERROR, type, message);
    }
    public debug(message: string, type: LogType = LogType.RAW) {
        this.raw(LogLevel.DEBUG, type, message);
    }
}
