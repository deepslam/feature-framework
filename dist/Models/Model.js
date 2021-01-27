"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validatorjs_1 = __importDefault(require("validatorjs"));
const Events_1 = require("../Events");
const Event_1 = __importDefault(require("../Models/Event"));
class Model {
    constructor(options) {
        this.baseEvents = {
            onUpdate: new Events_1.ModelWasUpdatedEvent(),
            onValidationFailed: new Event_1.default(),
            onValidationPassed: new Event_1.default(),
            onLoad: new Event_1.default(),
            onSave: new Event_1.default(),
        };
        this.rules = {};
        this.events = {};
        this.fields = Object.assign(Object.assign({}, this.defaultFieldValues), options);
    }
    get defaultFieldValues() {
        return {};
    }
    update(fields) {
        this.fields = Object.assign(Object.assign({}, this.fields), fields);
        this.baseEvents.onUpdate.fire(this);
    }
    setValidationRules(rules) {
        this.rules = Object.assign(Object.assign({}, this.rules), rules);
    }
    getValidationRules() {
        return this.rules;
    }
    validate() {
        const validation = new validatorjs_1.default(this.fields, this.getValidationRules());
        const isValidationPassed = validation.passes();
        if (isValidationPassed) {
            this.baseEvents.onValidationPassed.fire(this.fields);
        }
        else {
            this.baseEvents.onValidationFailed.fire({
                errors: validation.errors,
                fields: this.fields,
            });
        }
        return {
            is_passed: isValidationPassed,
            errors: validation.errors,
        };
    }
    save(dataManager, key) {
        return new Promise((resolve, reject) => {
            dataManager
                .save(key, this)
                .then((result) => {
                this.baseEvents.onSave.fire(result);
                return resolve(result);
            })
                .catch((e) => reject(e));
        });
    }
    load(dataManager, key) {
        return new Promise((resolve, reject) => {
            dataManager
                .load(key)
                .then((item) => {
                if (item) {
                    this.baseEvents.onLoad.fire(true);
                    this.update(item.fields);
                    return resolve(true);
                }
                this.baseEvents.onLoad.fire(false);
                return resolve(false);
            })
                .catch((e) => reject(e));
        });
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