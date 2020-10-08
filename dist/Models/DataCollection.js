"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ItemAddedEvent_1 = __importDefault(require("../Events/DataCollections/ItemAddedEvent"));
const ItemRemovedEvent_1 = __importDefault(require("../Events/DataCollections/ItemRemovedEvent"));
const CollectionClearedEvent_1 = __importDefault(require("../Events/DataCollections/CollectionClearedEvent"));
const ItemsFoundEvent_1 = __importDefault(require("../Events/DataCollections/ItemsFoundEvent"));
class DataCollection {
    constructor(items) {
        this.items = new Map();
        this.events = {
            onItemAdded: new ItemAddedEvent_1.default(),
            onItemRemoved: new ItemRemovedEvent_1.default(),
            onCollectionCleared: new CollectionClearedEvent_1.default(),
            onItemsFound: new ItemsFoundEvent_1.default(),
        };
        this.__class__ = new.target;
        if (items) {
            items.forEach((item) => {
                this.add(item);
            });
        }
    }
    add(item) {
        this.items.set(item, item);
        this.events.onItemAdded.fire(item);
    }
    remove(item) {
        if (this.items.has(item)) {
            this.items.delete(item);
            this.events.onItemRemoved.fire(item);
        }
    }
    contain(item) {
        return this.items.has(item);
    }
    clear() {
        this.items.clear();
        this.events.onCollectionCleared.fire(this);
    }
    getAll() {
        return [...this.items].map(([_, value]) => value);
    }
    length() {
        return this.items.size;
    }
    find(callback) {
        const result = [];
        this.items.forEach((item) => {
            if (callback(item)) {
                result.push(item);
            }
        });
        const newCollection = new this.__class__(result);
        this.events.onItemsFound.fire(newCollection);
        return newCollection;
    }
    paginate(page = 1, onPage = 20) {
        if (onPage <= 0) {
            throw Error('OnPage value should not be zero');
        }
        if (page <= 0) {
            throw Error('Current page value should not be zero');
        }
        return {
            allPages: Math.ceil(this.length() / onPage),
            currentPage: page,
            items: this.getAll().slice((page - 1) * onPage, page * onPage),
        };
    }
}
exports.default = DataCollection;
//# sourceMappingURL=DataCollection.js.map