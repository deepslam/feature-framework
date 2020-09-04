import { IEvent } from './IEvent';
import { IDataProvider } from './IDataProvider';

export interface IDataManager<T = unknown> {
  key: string;
  events: Record<string, IEvent<unknown>>;

  load(provider: IDataProvider): Promise<T | null>;
  save(provider: IDataProvider, data: T): Promise<boolean>;
}
