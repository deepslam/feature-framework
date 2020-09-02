import { IEvent } from './IEvent';

export interface IDataCollection<T, P = Record<string, string>> {
  items: Map<T, T>;
  events: Record<string, IEvent<unknown>>;

  add(item: T): void;
  remove(item: T): void;
  contain(item: T): boolean;
  clear(): void;
  length(): number;
  find(params: P): T[];
  getAll(): Map<IDataCollection<T, P>, T>;
  paginate(
    page: number,
    onPage: number,
  ): {
    allPages: number;
    currentPage: number;
    result: T[];
  };
}
