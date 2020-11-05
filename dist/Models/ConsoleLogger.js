"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Types_1 = require("../Types");
class ConsoleLogger {
    constructor(app) {
        this.app = app;
    }
    log(message, type = null) {
        if (this.app.debug) {
            switch (type) {
                case Types_1.ErrorTypeEnum.critical:
                case Types_1.ErrorTypeEnum.error:
                    console.error(message);
                    break;
                case Types_1.ErrorTypeEnum.warning:
                default:
                    console.warn(message);
            }
        }
    }
}
exports.default = ConsoleLogger;
//# sourceMappingURL=ConsoleLogger.js.map