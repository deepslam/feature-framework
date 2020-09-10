export interface IEvent<T> {
    subscribe(func: (item: T) => void): void;
    unsubscribe(func: (item: T) => void): void;
    fire(item: T): void;
    clear(): void;
}
