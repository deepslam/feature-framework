import { IEvent } from './IEvent';

export interface IDataCollection<
  T extends { new (...args: unknown[]): unknown }
> {
  items: WeakMap<T, InstanceType<T>>;
  events: Record<string, IEvent<unknown>>;

  add(item: T): void;
  remove(item: T): void;
  contain(item: T): boolean;
  find<T extends { new (...args: any[]): any }>(
    item: T,
    params: ConstructorParameters<T>,
  ): T[];
  getAll(): T[];
  paginate(
    page: number,
    onPage: number,
  ): {
    allPages: number;
    currentPage: number;
    result: T[];
  };
}
