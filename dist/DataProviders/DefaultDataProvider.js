"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data = new Map();
class DefaultDataProvider {
    save(key, saveData) {
        return new Promise((resolve) => {
            data.set(key, saveData);
            return resolve(true);
        });
    }
    load(key) {
        return new Promise((resolve) => {
            if (data.has(key)) {
                return resolve(data.get(key));
            }
            return resolve(null);
        });
    }
    remove(key) {
        return new Promise((resolve) => {
            if (data.has(key)) {
                data.delete(key);
                return resolve(true);
            }
            return resolve(false);
        });
    }
}
exports.default = DefaultDataProvider;
//# sourceMappingURL=DefaultDataProvider.js.map