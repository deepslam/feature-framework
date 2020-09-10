import { IDataCollection } from '../Interfaces';
import ItemAddedEvent from '../Events/DataCollections/ItemAddedEvent';
import ItemRemovedEvent from '../Events/DataCollections/ItemRemovedEvent';
import CollectionClearedEvent from '../Events/DataCollections/CollectionClearedEvent';
export default class DataCollection<T, P = Record<string, string>> implements IDataCollection<T, P> {
    readonly items: Map<any, any>;
    readonly __classname__: string;
    events: {
        onItemAdded: ItemAddedEvent<T>;
        onItemRemoved: ItemRemovedEvent<T>;
        onCollectionCleared: CollectionClearedEvent<IDataCollection<T, P>>;
    };
    add(item: T): void;
    remove(item: T): void;
    contain(item: T): boolean;
    clear(): void;
    getAll(): Map<any, any>;
    length(): number;
    find(params: P): T[];
    paginate(page: number, onPage: number): {
        allPages: number;
        currentPage: number;
        result: T[];
    };
}
