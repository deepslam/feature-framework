"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorTypes_1 = require("../Types/ErrorTypes");
class ConsoleLogger {
    constructor(app) {
        this.app = app;
    }
    log(message, type = null) {
        if (this.app.debug) {
            switch (type) {
                case ErrorTypes_1.ErrorTypeEnum.critical:
                case ErrorTypes_1.ErrorTypeEnum.error:
                    console.error(message);
                    break;
                case ErrorTypes_1.ErrorTypeEnum.warning:
                default:
                    console.warn(message);
            }
        }
    }
}
exports.default = ConsoleLogger;
//# sourceMappingURL=ConsoleLogger.js.map