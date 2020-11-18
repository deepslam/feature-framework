"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Events_1 = require("../Events");
class Model {
    constructor(options) {
        this.baseEvents = {
            updated: new Events_1.ModelWasUpdatedEvent(),
        };
        this.fields = options;
    }
    update(fields) {
        this.fields = Object.assign(Object.assign({}, this.fields), fields);
        this.baseEvents.updated.fire(this);
    }
    setField(key, value) {
        const updatedValues = {
            [key]: value,
        };
        this.update(updatedValues);
    }
    toJSON() {
        return Object.assign({}, this.fields);
    }
}
exports.default = Model;
//# sourceMappingURL=Model.js.map