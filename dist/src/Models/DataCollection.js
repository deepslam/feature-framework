"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ItemAddedEvent_1 = __importDefault(require("../Events/DataCollections/ItemAddedEvent"));
const ItemRemovedEvent_1 = __importDefault(require("../Events/DataCollections/ItemRemovedEvent"));
const CollectionClearedEvent_1 = __importDefault(require("../Events/DataCollections/CollectionClearedEvent"));
class DataCollection {
    constructor() {
        this.items = new Map();
        this.__classname__ = '';
        this.events = {
            onItemAdded: new ItemAddedEvent_1.default(),
            onItemRemoved: new ItemRemovedEvent_1.default(),
            onCollectionCleared: new CollectionClearedEvent_1.default(),
        };
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
        return this.items;
    }
    length() {
        return this.items.size;
    }
    find(params) {
        throw new Error('Method not implemented.');
    }
    paginate(page, onPage) {
        throw new Error('Method not implemented.');
    }
}
exports.default = DataCollection;
//# sourceMappingURL=DataCollection.js.map