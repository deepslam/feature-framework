"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DataManagerDataLoadedEvent_1 = __importDefault(require("../Events/DataManager/DataManagerDataLoadedEvent"));
const DataManagerDataSavedEvent_1 = __importDefault(require("../Events/DataManager/DataManagerDataSavedEvent"));
const DataManagerDataRemovedEvent_1 = __importDefault(require("../Events/DataManager/DataManagerDataRemovedEvent"));
const DataManagerDataLoadingErrorEvent_1 = __importDefault(require("../Events/DataManager/DataManagerDataLoadingErrorEvent"));
const DataManagerDataSavingErrorEvent_1 = __importDefault(require("../Events/DataManager/DataManagerDataSavingErrorEvent"));
const DataManagerDataRemovingErrorEvent_1 = __importDefault(require("../Events/DataManager/DataManagerDataRemovingErrorEvent"));
const ERR_PROVIDER_NOT_SET = 'Provider is not set';
const ERR_NO_LOAD_FUNC = 'Load function is not set';
const ERR_NO_SAVE_FUNC = 'Save function is not set';
const ERR_NO_REMOVE_FUNC = 'Remove function is not set';
class DataManager {
    constructor() {
        this.events = {
            DataLoaded: new DataManagerDataLoadedEvent_1.default(),
            DataLoadingError: new DataManagerDataLoadingErrorEvent_1.default(),
            DataSaved: new DataManagerDataSavedEvent_1.default(),
            DataSavingError: new DataManagerDataSavingErrorEvent_1.default(),
            DataRemoved: new DataManagerDataRemovedEvent_1.default(),
            DataRemovingError: new DataManagerDataRemovingErrorEvent_1.default(),
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
                return resolve(null);
            }
            try {
                this.provider
                    .load(key)
                    .then((data) => {
                    if (!data) {
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
                    return reject(e);
                });
            }
            catch (e) {
                this.events.DataLoadingError.fire({
                    key,
                    message: e,
                    result: false,
                });
                return reject(e);
            }
            return null;
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
                    return resolve(result);
                })
                    .catch((e) => {
                    this.events.DataSavingError.fire({
                        key,
                        message: e,
                        result: false,
                    });
                    return reject(e);
                });
            }
            catch (e) {
                this.events.DataSavingError.fire({
                    key,
                    message: e,
                    result: false,
                });
                return reject(e);
            }
            return null;
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
                    return resolve(result);
                })
                    .catch((e) => {
                    this.events.DataRemovingError.fire({
                        message: ERR_NO_REMOVE_FUNC,
                        key,
                        result: false,
                    });
                    return reject(e);
                });
            }
            catch (e) {
                this.events.DataRemovingError.fire({
                    message: ERR_NO_REMOVE_FUNC,
                    key,
                    result: false,
                });
                return reject(e);
            }
            return null;
        });
    }
}
exports.default = DataManager;
//# sourceMappingURL=DataManager.js.map