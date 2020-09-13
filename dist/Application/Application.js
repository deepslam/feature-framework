"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18next_1 = __importDefault(require("i18next"));
const toolkit_1 = require("@reduxjs/toolkit");
const Types_1 = require("../Types");
const Models_1 = require("../Models");
const App_1 = require("../Events/App");
class Application {
    constructor(config) {
        this.config = config;
        this.initialized = false;
        this.languages = [];
        this.currentLanguage = 'en';
        this.debug = false;
        this.baseEvents = {
            onAppLoaded: new App_1.AppLoadedEvent(),
            onAppError: new App_1.AppErrorEvent(),
        };
        this.logger = new Models_1.ConsoleLogger(this);
        this.errorHandler = new Models_1.ErrorHandler();
        this.additionalLoggers = [];
        this.additionalErrorHandlers = [];
    }
    cfg() {
        return this.config;
    }
    extendConfig(config) {
        this.config = Object.assign(Object.assign({}, this.config), config);
    }
    init() {
        return new Promise((resolve, reject) => {
            if (this.isInitialized()) {
                reject();
            }
            this.setAppToFeatures(this.features);
            const promises = [];
            Object.keys(this.features).forEach((key) => {
                promises.push(this.features[key].init());
            });
            this.initStore();
            this.initI18n()
                .then(() => Promise.all(promises))
                .then((args) => {
                const falseArgs = args.filter((arg) => !arg);
                if (falseArgs.length === 0) {
                    this.initialized = true;
                    this.baseEvents.onAppLoaded.fire(true);
                    resolve(true);
                }
                else {
                    this.throwErr('App initialization failed');
                    this.baseEvents.onAppLoaded.fire(false);
                    resolve(false);
                }
            })
                .catch((e) => {
                this.throwErr(`Unexpected error happened during app initialization (${e})`);
                reject();
            });
        });
    }
    isInitialized() {
        return this.initialized;
    }
    err(error) {
        this.baseEvents.onAppError.fire({
            message: error,
            type: Types_1.ErrorTypeEnum.error,
        });
        this.log(error, Types_1.ErrorTypeEnum.error);
        this.errorHandler.handleError(error, Types_1.ErrorTypeEnum.error);
        this.additionalErrorHandlers.forEach((handler) => handler.handleError(error, Types_1.ErrorTypeEnum.error));
    }
    throwErr(error) {
        this.baseEvents.onAppError.fire({
            message: error,
            type: Types_1.ErrorTypeEnum.critical,
        });
        this.log(error, Types_1.ErrorTypeEnum.critical);
        this.errorHandler.handleError(error, Types_1.ErrorTypeEnum.critical);
        this.additionalErrorHandlers.forEach((handler) => handler.handleError(error, Types_1.ErrorTypeEnum.critical));
    }
    warning(error) {
        this.baseEvents.onAppError.fire({
            message: error,
            type: Types_1.ErrorTypeEnum.warning,
        });
        this.log(error, Types_1.ErrorTypeEnum.warning);
        this.errorHandler.handleError(error, Types_1.ErrorTypeEnum.warning);
        this.additionalErrorHandlers.forEach((handler) => handler.handleError(error, Types_1.ErrorTypeEnum.warning));
    }
    log(message, type = Types_1.ErrorTypeEnum.warning) {
        this.logger.log(message, type);
        this.additionalLoggers.forEach((logger) => logger.log(message, type));
    }
    info(message) {
        this.log(message, Types_1.ErrorTypeEnum.info);
    }
    setAvailableLanguages(languages) {
        languages.forEach((lang) => {
            if (!this.languages.includes(lang.toLowerCase())) {
                this.languages.push(lang.toLowerCase());
            }
        });
    }
    getAvailableLanguages() {
        return this.languages;
    }
    isLanguageAvailable(language) {
        return (this.languages.includes(language.toLowerCase()) ||
            this.currentLanguage.toLowerCase() === language.toLowerCase());
    }
    setCurrentLanguage(language) {
        if (this.isLanguageAvailable(language)) {
            this.currentLanguage = language;
            return true;
        }
        return false;
    }
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    t(key, data) {
        return i18next_1.default.t(key, data);
    }
    error(err) {
        throw new Error(err);
    }
    initStore() {
        this.store = toolkit_1.configureStore({ reducer: toolkit_1.combineReducers(this.reducers) });
    }
    initI18n() {
        return new Promise((resolve) => {
            // i18n.use(initReactI18next).init(
            i18next_1.default.init({
                fallbackLng: this.currentLanguage,
                debug: false,
            }, (err) => {
                if (err)
                    throw new Error(`Error with i18n initialization: ${err}`);
                resolve(true);
            });
        });
    }
    setAppToFeatures(features) {
        Object.keys(features).forEach((key) => {
            if (!features[key].hasApp()) {
                features[key].setApp(this);
                if (features[key].features) {
                    this.setAppToFeatures(features[key].features);
                }
            }
        });
    }
}
exports.default = Application;
//# sourceMappingURL=Application.js.map