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
            this.provider
                .load(key)
                .then((data) => {
                const result = this.restore(data);
                this.events.DataLoaded.fire(result);
                resolve(result);
            })
                .catch(() => {
                this.events.DataLoadingError.fire(null);
                reject(null);
            });
        });
    }
    save(key, data) {
        return new Promise((resolve, reject) => {
            const dataToSave = this.pack(data);
            this.provider
                .save(key, dataToSave)
                .then(() => {
                this.events.DataSaved.fire(key);
                resolve(true);
            })
                .catch(() => {
                this.events.DataSavingError.fire(key);
                reject(false);
            });
        });
    }
    remove(key) {
        return new Promise((resolve) => {
            this.provider
                .remove(key)
                .then((result) => {
                if (result) {
                    this.events.DataRemoved.fire(key);
                }
                else {
                    this.events.DataRemovingError.fire(key);
                }
                resolve(result);
            })
                .catch(() => {
                this.events.DataRemovingError.fire(key);
                resolve(false);
            });
        });
    }
}
exports.default = DataManager;
//# sourceMappingURL=DataManager.js.map