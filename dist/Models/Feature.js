"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable consistent-return */
/* eslint-disable indent */
const uuid_1 = require("uuid");
const Features_1 = require("../Events/Features");
const Translations_1 = __importDefault(require("../Models/Translations"));
const privateData = new Map();
const appData = new Map();
class Feature {
    constructor(settings) {
        this.baseEvents = {
            initialized: new Features_1.FeatureInitializedEvent(),
            onError: new Features_1.FeatureErrorEvent(),
            onUpdate: new Features_1.FeatureUpdatedEvent(),
            onDataUpdate: new Features_1.FeatureDataUpdatedEvent(),
        };
        this.parentFeature = null;
        this.uuid = uuid_1.v4();
        this.config = {};
        this.events = {};
        this.collections = {};
        this.factories = {};
        this.views = {};
        this.models = {};
        this.dataManagers = {};
        this.features = {};
        this.translations = {};
        this.data = {};
        if (settings) {
            this.setInitialDataPartly(settings);
        }
    }
    setParentFeature(feature) {
        this.parentFeature = feature;
    }
    getParentFeature() {
        if (this.hasParentFeature()) {
            return this.parentFeature;
        }
    }
    hasParentFeature() {
        return this.parentFeature instanceof Feature;
    }
    setInitialData(data) {
        return this.setInitialDataPartly(data);
    }
    setInitialDataPartly(data) {
        if (this.isInitialized())
            return false;
        if (data.config) {
            this.config = data.config;
        }
        if (data.collections) {
            this.collections = data.collections;
        }
        if (data.dataManagers) {
            this.dataManagers = data.dataManagers;
        }
        if (data.events) {
            this.events = data.events;
        }
        if (data.factories) {
            this.factories = data.factories;
        }
        if (data.features) {
            this.features = data.features;
        }
        if (data.models) {
            this.models = data.models;
        }
        if (data.translations) {
            this.translations = data.translations;
        }
        if (data.views) {
            this.views = data.views;
        }
        if (data.data) {
            this.data = data.data;
        }
        return true;
    }
    setApp(app) {
        if (!appData.has(this.uuid)) {
            appData.set(this.uuid, app);
            return true;
        }
        return false;
    }
    getApp() {
        if (appData.has(this.uuid)) {
            return appData.get(this.uuid);
        }
        throw Error('App is not defined');
    }
    hasApp() {
        return appData.has(this.uuid);
    }
    init() {
        return new Promise((resolve, reject) => {
            const promises = [];
            if (this.features) {
                Object.keys(this.features).forEach((key) => {
                    if (this.features && this.features[key]) {
                        const feature = this.features[key];
                        feature.setParentFeature(this);
                        promises.push(feature.init());
                    }
                });
            }
            Promise.all(promises).then(() => {
                this.initTranslations();
                this.initFeature()
                    .then((result) => {
                    this.setInitialized(result);
                    this.baseEvents.initialized.fire(result);
                    this.getApp().baseEvents.onFeatureInitialized.fire(this);
                    this.getApp().info(`Feature '${this.name}' successfully initialized`);
                    return resolve(result);
                })
                    .catch((e) => {
                    this.baseEvents.onError.fire(false);
                    this.getApp().err(`Failed to initialize the feature '${this.name}' (${e})`);
                    return reject(e);
                });
            });
        });
    }
    initTranslations() {
        const setAppToTranslations = (translations) => {
            Object.keys(translations).forEach((translationKey) => {
                const translation = translations[translationKey];
                if (translation instanceof Translations_1.default) {
                    translation.setApp(this.getApp());
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
    cfg() {
        return this.config;
    }
    updateConfig(newConfig) {
        this.config = Object.assign(Object.assign({}, this.config), newConfig);
        this.baseEvents.onUpdate.fire(this);
        this.getApp().baseEvents.onFeatureUpdated.fire(this);
    }
    updateData(data) {
        this.data = Object.assign(Object.assign({}, this.data), data);
        this.baseEvents.onDataUpdate.fire(this);
    }
    isInitialized() {
        var _a;
        return ((_a = privateData.get(this.uuid)) === null || _a === void 0 ? void 0 : _a.initialized) || false;
    }
    setInitialized(initialized) {
        privateData.set(this.uuid, {
            initialized,
        });
    }
    update() {
        this.baseEvents.onUpdate.fire(this);
    }
}
exports.default = Feature;
//# sourceMappingURL=Feature.js.map