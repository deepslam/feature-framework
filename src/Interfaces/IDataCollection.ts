import {
  ItemAddedEvent,
  ItemRemovedEvent,
  ItemsFoundEvent,
  CollectionClearedEvent,
  ItemsSortedEvent,
} from '../Events/DataCollections';

export interface IDataCollection<T> {
  items: Map<T, T>;
  events: {
    onItemAdded: ItemAddedEvent<T>;
    onItemRemoved: ItemRemovedEvent<T>;
    onCollectionCleared: CollectionClearedEvent<IDataCollection<T>>;
    onItemsFound: ItemsFoundEvent<IDataCollection<T>>;
    onItemsSorted: ItemsSortedEvent<IDataCollection<T>>;
  };

  add(item: T): void;
  remove(item: T): void;
  contain(item: T): boolean;
  clear(): void;
  length(): number;
  find(callback: (item: T) => boolean): IDataCollection<T>;
  sort(callback: (a: T, b: T) => 0 | 1 | -1): IDataCollection<T>;
  getAll(): T[];
  paginate(
    page: number,
    onPage: number,
  ): {
    allPages: number;
    currentPage: number;
    items: T[];
  };
}
