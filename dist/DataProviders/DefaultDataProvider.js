"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data = new Map();
class DefaultDataProvider {
    save(key, saveData) {
        return new Promise((resolve) => {
            data.set(key, saveData);
            resolve(true);
        });
    }
    load(key) {
        return new Promise((resolve) => {
            if (data.has(key)) {
                resolve(data.get(key));
            }
            else {
                resolve(null);
            }
        });
    }
    remove(key) {
        return new Promise((resolve) => {
            if (data.has(key)) {
                data.delete(key);
                resolve(true);
            }
            else {
                resolve(false);
            }
        });
    }
}
exports.default = DefaultDataProvider;
//# sourceMappingURL=DefaultDataProvider.js.map