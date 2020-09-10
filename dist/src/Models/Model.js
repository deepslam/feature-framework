"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ModelWasUpdatedEvent_1 = __importDefault(require("../Events/Models/ModelWasUpdatedEvent"));
class Model {
    constructor(options) {
        this.baseEvents = {
            updated: new ModelWasUpdatedEvent_1.default(),
        };
        this.fields = options;
    }
    update(fields) {
        this.fields = Object.assign(Object.assign({}, this.fields), fields);
        this.baseEvents.updated.fire(this);
    }
    toJSON() {
        return Object.assign({}, this.fields);
    }
}
exports.default = Model;
//# sourceMappingURL=Model.js.map