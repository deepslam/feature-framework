import { IDataCollection } from '../Interfaces';
import ItemAddedEvent from '../Events/DataCollections/ItemAddedEvent';
import ItemRemovedEvent from '../Events/DataCollections/ItemRemovedEvent';
import CollectionClearedEvent from '../Events/DataCollections/CollectionClearedEvent';
import ItemsFoundEvent from '../Events/DataCollections/ItemsFoundEvent';
import { Constructor } from 'Types';
export default class DataCollection<T> implements IDataCollection<T> {
    readonly items: Map<any, any>;
    readonly __class__: Constructor<IDataCollection<T>>;
    events: {
        onItemAdded: ItemAddedEvent<T>;
        onItemRemoved: ItemRemovedEvent<T>;
        onCollectionCleared: CollectionClearedEvent<IDataCollection<T>>;
        onItemsFound: ItemsFoundEvent<IDataCollection<T>>;
    };
    constructor(items?: T[]);
    add(item: T): void;
    remove(item: T): void;
    contain(item: T): boolean;
    clear(): void;
    getAll(): any[];
    length(): number;
    find(callback: (item: T) => boolean): IDataCollection<T>;
    paginate(page?: number, onPage?: number): {
        allPages: number;
        currentPage: number;
        items: T[];
    };
}
