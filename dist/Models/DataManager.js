"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DataLoadedEvent_1 = __importDefault(require("../Events/DataManager/DataLoadedEvent"));
const DataSavedEvent_1 = __importDefault(require("../Events/DataManager/DataSavedEvent"));
const DataRemovedEvent_1 = __importDefault(require("../Events/DataManager/DataRemovedEvent"));
const DataLoadingErrorEvent_1 = __importDefault(require("../Events/DataManager/DataLoadingErrorEvent"));
const DataSavingErrorEvent_1 = __importDefault(require("../Events/DataManager/DataSavingErrorEvent"));
const DataRemovingErrorEvent_1 = __importDefault(require("../Events/DataManager/DataRemovingErrorEvent"));
const ERR_PROVIDER_NOT_SET = 'Provider is not set';
const ERR_NO_LOAD_FUNC = 'Load function is not set';
const ERR_NO_SAVE_FUNC = 'Save function is not set';
const ERR_NO_REMOVE_FUNC = 'Remove function is not set';
class DataManager {
    constructor() {
        this.events = {
            DataLoaded: new DataLoadedEvent_1.default(),
            DataLoadingError: new DataLoadingErrorEvent_1.default(),
            DataSaved: new DataSavedEvent_1.default(),
            DataSavingError: new DataSavingErrorEvent_1.default(),
            DataRemoved: new DataRemovedEvent_1.default(),
            DataRemovingError: new DataRemovingErrorEvent_1.default(),
        };
    }
    load(key) {
        return new Promise((resolve, reject) => {
            if (!this.provider) {
                this.events.DataLoadingError.fire({
                    message: ERR_PROVIDER_NOT_SET,
                    key,
                    result: false,
                });
                throw new Error(ERR_PROVIDER_NOT_SET);
            }
            if (!this.provider.load) {
                this.events.DataLoadingError.fire({
                    message: ERR_NO_LOAD_FUNC,
                    key,
                    result: false,
                });
                resolve(null);
            }
            try {
                this.provider
                    .load(key)
                    .then((data) => {
                    if (data === null) {
                        return resolve(null);
                    }
                    const result = this.restore(data);
                    this.events.DataLoaded.fire(result);
                    return resolve(result);
                })
                    .catch((e) => {
                    this.events.DataLoadingError.fire({
                        key,
                        message: e,
                        result: false,
                    });
                    reject(e);
                });
            }
            catch (e) {
                this.events.DataLoadingError.fire({
                    key,
                    message: e,
                    result: false,
                });
                reject(e);
            }
        });
    }
    save(key, data) {
        return new Promise((resolve, reject) => {
            if (!this.provider) {
                this.events.DataSavingError.fire({
                    message: ERR_PROVIDER_NOT_SET,
                    key,
                    result: false,
                });
                throw new Error(ERR_PROVIDER_NOT_SET);
            }
            if (!this.provider.save) {
                this.events.DataSavingError.fire({
                    message: ERR_NO_SAVE_FUNC,
                    key,
                    result: false,
                });
                throw new Error(ERR_NO_SAVE_FUNC);
            }
            try {
                const dataToSave = this.pack(data);
                this.provider
                    .save(key, dataToSave)
                    .then((result) => {
                    if (result) {
                        this.events.DataSaved.fire(key);
                    }
                    resolve(result);
                })
                    .catch((e) => {
                    this.events.DataSavingError.fire({
                        key,
                        message: e,
                        result: false,
                    });
                    reject(e);
                });
            }
            catch (e) {
                this.events.DataSavingError.fire({
                    key,
                    message: e,
                    result: false,
                });
                reject(e);
            }
        });
    }
    remove(key) {
        return new Promise((resolve, reject) => {
            if (!this.provider) {
                this.events.DataRemovingError.fire({
                    result: false,
                    message: ERR_PROVIDER_NOT_SET,
                    key,
                });
                throw new Error(ERR_PROVIDER_NOT_SET);
            }
            if (!this.provider.remove) {
                this.events.DataRemovingError.fire({
                    message: ERR_NO_REMOVE_FUNC,
                    key,
                    result: false,
                });
                throw new Error(ERR_NO_REMOVE_FUNC);
            }
            try {
                this.provider
                    .remove(key)
                    .then((result) => {
                    if (result) {
                        this.events.DataRemoved.fire(key);
                    }
                    else {
                        this.events.DataRemovingError.fire({
                            key,
                            result: false,
                        });
                    }
                    resolve(result);
                })
                    .catch((e) => {
                    this.events.DataRemovingError.fire({
                        message: ERR_NO_REMOVE_FUNC,
                        key,
                        result: false,
                    });
                    reject(e);
                });
            }
            catch (e) {
                this.events.DataRemovingError.fire({
                    message: ERR_NO_REMOVE_FUNC,
                    key,
                    result: false,
                });
                reject(e);
            }
        });
    }
}
exports.default = DataManager;
//# sourceMappingURL=DataManager.js.map