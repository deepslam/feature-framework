import { IEvent } from './IEvent';
export interface IDataCollection<T> {
    items: Map<T, T>;
    events: Record<string, IEvent<unknown>>;
    add(item: T): void;
    remove(item: T): void;
    contain(item: T): boolean;
    clear(): void;
    length(): number;
    find(callback: (item: T) => boolean): IDataCollection<T>;
    sort(callback: (a: T, b: T) => 0 | 1 | -1): IDataCollection<T>;
    getAll(): T[];
    paginate(page: number, onPage: number): {
        allPages: number;
        currentPage: number;
        items: T[];
    };
}
