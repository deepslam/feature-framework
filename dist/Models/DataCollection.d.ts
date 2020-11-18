import { IDataCollection } from '../Interfaces';
import { Constructor, DataCollectionStandardEventsType } from '../Types';
export default class DataCollection<T> implements IDataCollection<T> {
    readonly items: Map<any, any>;
    readonly __class__: Constructor<IDataCollection<T>>;
    events: DataCollectionStandardEventsType<T>;
    constructor(items?: T[]);
    add(item: T): void;
    remove(item: T): void;
    contain(item: T): boolean;
    clear(): void;
    getAll(): any[];
    length(): number;
    find(callback: (item: T) => boolean): IDataCollection<T>;
    sort(callback: (a: T, b: T) => 0 | 1 | -1): IDataCollection<T>;
    paginate(page?: number, onPage?: number): {
        allPages: number;
        currentPage: number;
        items: T[];
    };
}
