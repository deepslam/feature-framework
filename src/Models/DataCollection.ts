import { IDataCollection } from './../Interfaces/IDataCollection';
import ItemAddedEvent from '../Events/DataCollections/ItemAddedEvent';
import ItemRemovedEvent from '../Events/DataCollections/ItemRemovedEvent';

export default class DataCollection<
  T extends { new (...args: unknown[]): unknown }
> implements IDataCollection<T> {
  private items = new WeakMap();
  events: {
    onItemAdded: ItemAddedEvent<T>;
    onItemRemoved: ItemRemovedEvent<T>;
  } = {
    onItemAdded: new ItemAddedEvent(),
    onItemRemoved: new ItemRemovedEvent(),
  };

  add(item: T) {
    this.items.set(this, item);
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

  find<T extends new (...args: any[]) => any>(
    item: T,
    params: ConstructorParameters<T>,
  ): boolean {
    throw new Error('Method not implemented.');
  }
  paginate(
    page: number,
    onPage: number,
  ): { allPages: number; currentPage: number; result: T[] } {
    throw new Error('Method not implemented.');
  }
}
