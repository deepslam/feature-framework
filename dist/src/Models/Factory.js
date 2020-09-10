"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Factory {
    constructor(model) {
        this.model = model;
    }
    static create(ClassToCreate, ...args) {
        return new ClassToCreate(...args);
    }
    new(...args) {
        return new this.model(args);
    }
}
exports.default = Factory;
//# sourceMappingURL=Factory.js.map