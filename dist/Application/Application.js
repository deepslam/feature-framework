"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const locale_enum_1 = require("locale-enum");
const Types_1 = require("../Types");
const Models_1 = require("../Models");
const App_1 = require("../Events/App");
const privateFeatures = new Map();
class Application {
    constructor(data, locales = {
        locales: [locale_enum_1.Locale.en],
        fallbackLocale: locale_enum_1.Locale.en,
        defaultLocale: locale_enum_1.Locale.en,
    }) {
        this.initialized = false;
        this.locales = [locale_enum_1.Locale.en];
        this.locale = locale_enum_1.Locale.en;
        this.fallbackLocale = locale_enum_1.Locale.en;
        this.debug = false;
        this.baseEvents = {
            onAppLoaded: new App_1.AppLoadedEvent(),
            onAppError: new App_1.AppErrorEvent(),
            onAppLocaleChanged: new App_1.AppLocaleChangedEvent(),
            onUpdate: new App_1.AppUpdatedEvent(),
            onFeatureInitialized: new App_1.AppFeatureInitializedEvent(),
            onFeatureUpdated: new App_1.AppFeatureUpdatedEvent(),
        };
        this.logger = new Models_1.ConsoleLogger(this);
        this.errorHandler = new Models_1.ErrorHandler();
        this.additionalLoggers = [];
        this.additionalErrorHandlers = [];
        this.locales = locales.locales || [locale_enum_1.Locale.en];
        this.fallbackLocale = locales.fallbackLocale || locale_enum_1.Locale.en;
        this.setCurrentLocale(locales.defaultLocale || locale_enum_1.Locale.en);
        this.config = {};
        this.events = {};
        this.collections = {};
        this.factories = {};
        this.views = {};
        this.models = {};
        this.dataManagers = {};
        this.dataProviders = {};
        this.translations = {};
        this.additionalErrorHandlers = [];
        this.additionalLoggers = [];
        privateFeatures.set(this, {});
        if (data) {
            this.setData(data);
        }
    }
    setData(data) {
        if (this.isInitialized())
            return false;
        if (data.features) {
            privateFeatures.set(this, data.features);
        }
        if (data.config) {
            this.config = data.config;
        }
        if (data.events) {
            this.events = data.events;
        }
        if (data.collections) {
            this.collections = data.collections;
        }
        if (data.factories) {
            this.factories = data.factories;
        }
        if (data.views) {
            this.views = data.views;
        }
        if (data.models) {
            this.models = data.models;
        }
        if (data.dataManagers) {
            this.dataManagers = data.dataManagers;
        }
        if (data.dataProviders) {
            this.dataProviders = data.dataProviders;
        }
        if (data.translations) {
            this.translations = data.translations;
        }
        if (data.additionalErrorHandlers) {
            this.additionalErrorHandlers = data.additionalErrorHandlers;
        }
        if (data.additionalLoggers) {
            this.additionalLoggers = data.additionalLoggers;
        }
        return true;
    }
    extendConfig(config) {
        this.config = Object.assign(Object.assign({}, this.config), config);
        this.baseEvents.onUpdate.fire(this.config);
    }
    setConfig(key, value) {
        this.config = Object.assign(Object.assign({}, this.config), { [key]: value });
        this.baseEvents.onUpdate.fire(this.config);
    }
    features() {
        if (privateFeatures.has(this)) {
            return privateFeatures.get(this);
        }
        throw Error('Features are not defined for application!');
    }
    setFeatures(features) {
        privateFeatures.set(this, features);
    }
    init(data) {
        return new Promise((resolve, reject) => {
            try {
                if (this.isInitialized()) {
                    reject('App is already initialized!');
                }
                if (data) {
                    this.setData(data);
                }
                const promises = [];
                if (this.features()) {
                    this.setAppToFeatures(this.features());
                    Object.keys(this.features()).forEach((key) => {
                        promises.push(this.features()[key].init());
                    });
                }
                this.initTranslations();
                Promise.all(promises)
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
                    reject(`Unexpected error happened during app initialization (${e})`);
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    initTranslations() {
        const setAppToTranslations = (translations) => {
            Object.keys(translations).forEach((translationKey) => {
                const translation = translations[translationKey];
                if (translation instanceof Models_1.Translations) {
                    translation.setApp(this);
                }
                else if (typeof translation === 'object' &&
                    Object.keys(translation).length > 0) {
                    setAppToTranslations(translation);
                }
            });
        };
        if (this.translations) {
            setAppToTranslations(this.translations);
        }
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
    setLocales(locales) {
        locales.forEach((locale) => {
            if (!this.locales.includes(locale)) {
                this.locales.push(locale);
            }
        });
    }
    getAvailableLocales() {
        return this.locales;
    }
    isLocaleAvailable(locale) {
        return (this.locales.includes(locale) || this.locale.toLowerCase() === locale);
    }
    setCurrentLocale(locale) {
        if (this.isLocaleAvailable(locale)) {
            this.locale = locale;
            this.baseEvents.onAppLocaleChanged.fire(locale);
            return true;
        }
        return false;
    }
    getCurrentLocale() {
        return this.locale;
    }
    t(value, data = {}, number) {
        if (typeof value === 'string') {
            return Models_1.Translations.template(value, data || {});
        }
        else if (typeof value === 'object' &&
            value.plural &&
            value.one &&
            value.zero) {
            const params = data || {};
            if (number === 0) {
                return Models_1.Translations.template(value.zero, params);
            }
            else if (number === 1) {
                return Models_1.Translations.template(value.one, params);
            }
            else if (number && number > 1) {
                if (typeof value.plural === 'string') {
                    return Models_1.Translations.template(value.plural, params);
                }
                else {
                    return Models_1.Translations.template(value.plural(number), params);
                }
            }
            else {
                return '';
            }
        }
        return '';
    }
    error(err) {
        throw new Error(err);
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