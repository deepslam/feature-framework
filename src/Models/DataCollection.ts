import { IDataCollection } from '../Interfaces';
import ItemAddedEvent from '../Events/DataCollections/ItemAddedEvent';
import ItemRemovedEvent from '../Events/DataCollections/ItemRemovedEvent';
import CollectionClearedEvent from '../Events/DataCollections/CollectionClearedEvent';

export default class DataCollection<T, P = Record<string, string>>
  implements IDataCollection<T, P> {
  public readonly items = new Map();
  public readonly __classname__: string = '';
  events: {
    onItemAdded: ItemAddedEvent<T>;
    onItemRemoved: ItemRemovedEvent<T>;
    onCollectionCleared: CollectionClearedEvent<IDataCollection<T, P>>;
  } = {
    onItemAdded: new ItemAddedEvent(),
    onItemRemoved: new ItemRemovedEvent(),
    onCollectionCleared: new CollectionClearedEvent(),
  };

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
    return this.items;
  }

  length() {
    return this.items.size;
  }

  find(params: P): T[] {
    throw new Error('Method not implemented.');
  }

  paginate(
    page: number,
    onPage: number,
  ): { allPages: number; currentPage: number; result: T[] } {
    throw new Error('Method not implemented.');
  }
}
