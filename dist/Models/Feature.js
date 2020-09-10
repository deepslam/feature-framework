"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable indent */
const uuid_1 = require("uuid");
const SuccessfullyInitializedEvent_1 = __importDefault(require("../Events/Features/SuccessfullyInitializedEvent"));
const privateData = new Map();
class Feature {
    constructor(config) {
        this.config = config;
        this.baseEvents = {
            initialized: new SuccessfullyInitializedEvent_1.default(),
        };
        this.app = null;
        this.uuid = uuid_1.v4();
    }
    setApp(app) {
        if (this.app === null) {
            this.app = app;
            return true;
        }
        return false;
    }
    getApp() {
        return this.app;
    }
    hasApp() {
        return this.app !== null;
    }
    init() {
        return new Promise((resolve) => {
            const promises = [];
            if (this.features) {
                Object.keys(this.features).forEach((key) => {
                    if (this.features && this.features[key]) {
                        const feature = this.features[key];
                        promises.push(feature.init());
                    }
                });
            }
            Promise.all(promises).then(() => {
                this.initFeature().then((result) => {
                    this.setInitialized(result);
                    this.baseEvents.initialized.fire(result);
                    resolve(result);
                });
            });
        });
    }
    cfg() {
        return this.config;
    }
    extendConfig(newConfig) {
        this.config = Object.assign(Object.assign({}, this.config), newConfig);
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
    hasSlice() {
        return (typeof this.slices !== undefined &&
            Object.keys(this.slices).length > 0 &&
            this.isInitialized());
    }
}
exports.default = Feature;
//# sourceMappingURL=Feature.js.map