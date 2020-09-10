"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DataLoadedEvent_1 = __importDefault(require("../Events/DataManager/DataLoadedEvent"));
const DataSavedEvent_1 = __importDefault(require("../Events/DataManager/DataSavedEvent"));
const DataLoadingErrorEvent_1 = __importDefault(require("../Events/DataManager/DataLoadingErrorEvent"));
const DataSavingErrorEvent_1 = __importDefault(require("../Events/DataManager/DataSavingErrorEvent"));
class DataManager {
    constructor(provider) {
        this.provider = provider;
        this.events = {
            DataLoaded: new DataLoadedEvent_1.default(),
            DataLoadingError: new DataLoadingErrorEvent_1.default(),
            DataSaved: new DataSavedEvent_1.default(),
            DataSavingError: new DataSavingErrorEvent_1.default(),
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
                this.events.DataSaved.fire(true);
                resolve(true);
            })
                .catch(() => {
                this.events.DataSavingError.fire(false);
                reject(false);
            });
        });
    }
}
exports.default = DataManager;
//# sourceMappingURL=DataManager.js.map