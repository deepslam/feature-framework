"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataCollections_1 = require("../Events/DataCollections");
class DataCollection {
    constructor(items) {
        this.items = new Map();
        this.events = {
            onItemAdded: new DataCollections_1.CollectionItemAddedEvent(),
            onItemRemoved: new DataCollections_1.CollectionItemRemovedEvent(),
            onCollectionCleared: new DataCollections_1.CollectionClearedEvent(),
            onItemsFound: new DataCollections_1.CollectionItemsFoundEvent(),
            onItemsSorted: new DataCollections_1.CollectionItemsSortedEvent(),
            onCollectionExtended: new DataCollections_1.CollectionExtendedEvent(),
            onCollectionFilled: new DataCollections_1.CollectionFilledEvent(),
        };
        this.__class__ = new.target;
        if (items) {
            items.forEach((item) => {
                this.add(item);
            });
        }
    }
    add(item, addToTheEnd = true) {
        if (addToTheEnd) {
            this.items.set(item, item);
        }
        else {
            const newMap = new Map();
            newMap.set(item, item);
            this.items.forEach((item, key) => {
                newMap.set(key, item);
            });
            this.items.clear();
            this.items = newMap;
        }
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
    first() {
        return this.toArray()[0] || null;
    }
    last() {
        return this.toArray()[this.length() - 1] || null;
    }
    toArray() {
        return [...this.items].map(([, value]) => value);
    }
    length() {
        return this.items.size;
    }
    isEmpty() {
        return this.length() === 0;
    }
    filter(callback) {
        return this.find(callback);
    }
    find(callback) {
        const result = [];
        let index = 0;
        this.items.forEach((item) => {
            if (callback(item, index)) {
                result.push(item);
            }
            index++;
        });
        const newCollection = new this.__class__(result);
        this.events.onItemsFound.fire(newCollection);
        return newCollection;
    }
    forEach(callback) {
        this.items.forEach((item) => {
            callback(item);
        });
    }
    findByKeyValue(key, value) {
        const foundItems = this.find((item) => item[key] && item[key] === value);
        if (!foundItems.isEmpty())
            return foundItems.first();
        return null;
    }
    sort(callback) {
        const newData = this.toArray().sort(callback);
        this.clear();
        this.fill(newData);
        this.events.onItemsSorted.fire(this);
        return this;
    }
    getByIndex(index) {
        if (this.hasIndex(index)) {
            return this.toArray()[index];
        }
        return null;
    }
    hasIndex(index) {
        return this.toArray()[index];
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
            items: this.toArray().slice((page - 1) * onPage, page * onPage),
        };
    }
    fill(data) {
        this.clear();
        this.updateData(data);
        this.events.onCollectionFilled.fire(this);
    }
    extend(data) {
        this.updateData(data);
        this.events.onCollectionExtended.fire(this);
    }
    updateData(data) {
        data.forEach((item) => this.add(item));
    }
    map(callback) {
        const collection = new DataCollection();
        this.toArray().forEach((item, index) => {
            collection.add(callback(item, index));
        });
        return collection;
    }
    getItems() {
        return this.items;
    }
}
exports.default = DataCollection;
//# sourceMappingURL=DataCollection.js.map