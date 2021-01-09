import { IDataCollection } from '../Interfaces';
import { Constructor, DataCollectionStandardEventsType } from '../Types';
export default class DataCollection<T> implements IDataCollection<T> {
    private items;
    readonly __class__: Constructor<DataCollection<T>>;
    events: DataCollectionStandardEventsType<T>;
    constructor(items?: T[]);
    add(item: T, addToTheEnd?: boolean): void;
    remove(item: T): void;
    contain(item: T): boolean;
    clear(): void;
    first(): T | null;
    last(): T | null;
    toArray(): T[];
    length(): number;
    filter(callback: (item: T, index: number) => boolean): DataCollection<T>;
    find(callback: (item: T, index: number) => boolean): DataCollection<T>;
    sort(callback: (a: T, b: T) => 0 | 1 | -1): DataCollection<T>;
    getByIndex(index: number): T | null;
    hasIndex(index: number): T | null;
    paginate(page?: number, onPage?: number): {
        allPages: number;
        currentPage: number;
        items: T[];
    };
    fill(data: T[]): void;
    extend(data: T[]): void;
    updateData(data: T[]): void;
    map<R>(callback: (item: T) => R): IDataCollection<R>;
}
