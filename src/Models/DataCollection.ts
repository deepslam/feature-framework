import { IDataCollection } from '../Interfaces';
import ItemAddedEvent from '../Events/DataCollections/ItemAddedEvent';
import ItemRemovedEvent from '../Events/DataCollections/ItemRemovedEvent';
import CollectionClearedEvent from '../Events/DataCollections/CollectionClearedEvent';
import ItemsFoundEvent from '../Events/DataCollections/ItemsFoundEvent';
import { Constructor } from 'Types';

export default class DataCollection<T> implements IDataCollection<T> {
  public readonly items = new Map();
  public readonly __class__: Constructor<IDataCollection<T>>;

  events: {
    onItemAdded: ItemAddedEvent<T>;
    onItemRemoved: ItemRemovedEvent<T>;
    onCollectionCleared: CollectionClearedEvent<IDataCollection<T>>;
    onItemsFound: ItemsFoundEvent<IDataCollection<T>>;
  } = {
    onItemAdded: new ItemAddedEvent(),
    onItemRemoved: new ItemRemovedEvent(),
    onCollectionCleared: new CollectionClearedEvent(),
    onItemsFound: new ItemsFoundEvent(),
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

  getAll() {
    return [...this.items].map(([_, value]) => value);
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

  paginate(
    page: number = 1,
    onPage: number = 20,
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
