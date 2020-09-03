import { IEvent } from './IEvent';

export interface IDataManager<T = unknown> {
  key: string;
  events: Record<string, IEvent<unknown>>;

  load(): Promise<T | false>;
  save(data: T): Promise<boolean>;
}
