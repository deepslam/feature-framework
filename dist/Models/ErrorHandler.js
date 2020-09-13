"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Types_1 = require("../Types");
class ErrorHandler {
    handleError(message, type) {
        if (type === Types_1.ErrorTypeEnum.critical) {
            throw new Error(message);
        }
    }
}
exports.default = ErrorHandler;
//# sourceMappingURL=ErrorHandler.js.map