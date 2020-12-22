"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Translations {
    constructor(translations = {}) {
        this.translations = translations;
    }
    static template(str, data) {
        let s = str;
        for (const prop in data) {
            s = s.replace(new RegExp('{' + prop + '}', 'g'), data[prop]);
        }
        return s;
    }
    setApp(app) {
        this.app = app;
    }
    toArray() {
        if (!this.app) {
            return [];
        }
        if (this.translations[this.app.locale]) {
            return Object.values(this.translations[this.app.locale]);
        }
        if (this.translations[this.app.fallbackLocale]) {
            return Object.values(this.translations[this.app.fallbackLocale]);
        }
        return [];
    }
    get t() {
        if (!this.app) {
            return null;
        }
        if (this.translations[this.app.locale]) {
            return this.translations[this.app.locale];
        }
        if (this.translations[this.app.fallbackLocale]) {
            return this.translations[this.app.fallbackLocale];
        }
        return null;
    }
}
exports.default = Translations;
//# sourceMappingURL=Translations.js.map