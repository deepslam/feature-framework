import { DataCollectionStandardEventsType } from '../Types/EventTypes';
export interface IDataCollection<T> {
    events: DataCollectionStandardEventsType<T>;
    add(item: T, addToTheEnd?: boolean): void;
    getByIndex(index: number): T | null;
    remove(item: T): void;
    contain(item: T): boolean;
    clear(): void;
    length(): number;
    isEmpty(): boolean;
    filter(callback: (item: T) => boolean): IDataCollection<T>;
    find(callback: (item: T) => boolean): IDataCollection<T>;
    findByKeyValue<K extends keyof T>(key: K, value: T[K]): T | null;
    sort(callback: (a: T, b: T) => 0 | 1 | -1): IDataCollection<T>;
    map<R>(callback: (item: T, index: number) => R): IDataCollection<R>;
    fill(items: T[]): void;
    extend(items: T[]): void;
    toArray(): T[];
    paginate(page: number, onPage: number): {
        allPages: number;
        currentPage: number;
        items: T[];
    };
    getItems(): Map<T, T>;
}
