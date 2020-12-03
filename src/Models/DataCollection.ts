import { IDataCollection } from '../Interfaces';
import {
  CollectionClearedEvent,
  CollectionItemAddedEvent,
  CollectionItemRemovedEvent,
  CollectionItemsFoundEvent,
  CollectionItemsSortedEvent,
} from '../Events/DataCollections';
import { Constructor, DataCollectionStandardEventsType } from '../Types';

export default class DataCollection<T> implements IDataCollection<T> {
  public readonly items = new Map();
  public readonly __class__: Constructor<IDataCollection<T>>;

  events: DataCollectionStandardEventsType<T> = {
    onItemAdded: new CollectionItemAddedEvent(),
    onItemRemoved: new CollectionItemRemovedEvent(),
    onCollectionCleared: new CollectionClearedEvent(),
    onItemsFound: new CollectionItemsFoundEvent(),
    onItemsSorted: new CollectionItemsSortedEvent(),
  };

  public constructor(items?: T[]) {
    this.__class__ = new.target;
    if (items) {
      items.forEach((item) => {
        this.add(item);
      });
    }
  }

  add(item: T) {
    this.items.set(item, item);
    this.events.onItemAdded.fire(item);
  }

  remove(item: T) {
    if (this.items.has(item)) {
      this.items.delete(item);
      this.events.onItemRemoved.fire(item);
    }
  }

  contain(item: T) {
    return this.items.has(item);
  }

  clear() {
    this.items.clear();
    this.events.onCollectionCleared.fire(this);
  }

  first(): T | null {
    return this.getAll()[0] || null;
  }

  last(): T | null {
    return this.getAll()[this.length() - 1] || null;
  }

  getAll() {
    return [...this.items].map(([, value]) => value);
  }

  length() {
    return this.items.size;
  }

  find(callback: (item: T) => boolean): IDataCollection<T> {
    const result: T[] = [];
    this.items.forEach((item) => {
      if (callback(item)) {
        result.push(item);
      }
    });
    const newCollection = new this.__class__(result);
    this.events.onItemsFound.fire(newCollection);
    return newCollection;
  }

  sort(callback: (a: T, b: T) => 0 | 1 | -1): IDataCollection<T> {
    const newCollection = new this.__class__(this.getAll().sort(callback));
    this.events.onItemsSorted.fire(newCollection);
    return newCollection;
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
      items: this.getAll().slice((page - 1) * onPage, page * onPage),
    };
  }
}
