import { IDataCollection } from '../Interfaces';
import {
  CollectionClearedEvent,
  CollectionExtendedEvent,
  CollectionFilledEvent,
  CollectionItemAddedEvent,
  CollectionItemRemovedEvent,
  CollectionItemsFoundEvent,
  CollectionItemsSortedEvent,
} from '../Events/DataCollections';
import { Constructor, DataCollectionStandardEventsType } from '../Types';

export default class DataCollection<T> implements IDataCollection<T> {
  private items = new Map();
  public readonly __class__: Constructor<DataCollection<T>>;

  events: DataCollectionStandardEventsType<T> = {
    onItemAdded: new CollectionItemAddedEvent(),
    onItemRemoved: new CollectionItemRemovedEvent(),
    onCollectionCleared: new CollectionClearedEvent(),
    onItemsFound: new CollectionItemsFoundEvent(),
    onItemsSorted: new CollectionItemsSortedEvent(),
    onCollectionExtended: new CollectionExtendedEvent(),
    onCollectionFilled: new CollectionFilledEvent(),
  };

  public constructor(items?: T[]) {
    this.__class__ = new.target;
    if (items) {
      items.forEach((item) => {
        this.add(item);
      });
    }
  }

  add(item: T, addToTheEnd = true): void {
    if (addToTheEnd) {
      this.items.set(item, item);
    } else {
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

  remove(item: T) {
    if (this.items.has(item)) {
      this.items.delete(item);
      this.events.onItemRemoved.fire(item);
    }
  }

  contain(item: T): boolean {
    return this.items.has(item);
  }

  clear(): void {
    this.items.clear();
    this.events.onCollectionCleared.fire(this);
  }

  first(): T | null {
    return this.toArray()[0] || null;
  }

  last(): T | null {
    return this.toArray()[this.length() - 1] || null;
  }

  toArray(): T[] {
    return [...this.items].map(([, value]) => value);
  }

  length(): number {
    return this.items.size;
  }

  isEmpty(): boolean {
    return this.length() === 0;
  }

  filter(callback: (item: T, index: number) => boolean): DataCollection<T> {
    return this.find(callback);
  }

  find(callback: (item: T, index: number) => boolean): DataCollection<T> {
    const result: T[] = [];
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

  sort(callback: (a: T, b: T) => 0 | 1 | -1): DataCollection<T> {
    const newData = this.toArray().sort(callback);
    this.clear();
    this.fill(newData);
    this.events.onItemsSorted.fire(this);
    return this;
  }

  getByIndex(index: number): T | null {
    if (this.hasIndex(index)) {
      return this.toArray()[index];
    }

    return null;
  }

  hasIndex(index: number): T | null {
    return this.toArray()[index];
  }

  paginate(
    page = 1,
    onPage = 20,
  ): { allPages: number; currentPage: number; items: T[] } {
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

  fill(data: T[]): void {
    this.clear();
    this.updateData(data);
    this.events.onCollectionFilled.fire(this);
  }

  extend(data: T[]): void {
    this.updateData(data);
    this.events.onCollectionExtended.fire(this);
  }

  updateData(data: T[]): void {
    data.forEach((item) => this.add(item));
  }

  map<R>(callback: (item: T, index: number) => R): IDataCollection<R> {
    const collection = new DataCollection() as IDataCollection<R>;

    this.toArray().forEach((item, index) => {
      collection.add(callback(item, index));
    });

    return collection;
  }

  getItems(): Map<T, T> {
    return this.items;
  }
}
