import { IEvent } from './IEvent';
import { IDataProvider } from './IDataProvider';

export interface IDataManager<T = unknown> {
  events: Record<string, IEvent<unknown>>;
  provider: IDataProvider;

  load(key: string): Promise<T | null>;
  save(key: string, data: T): Promise<boolean>;
}
