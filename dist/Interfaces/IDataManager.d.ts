import { IDataProvider } from './IDataProvider';
import { DataManagerStandardEventsType } from '../Types/EventTypes';
export interface IDataManager<T = unknown> {
    events: DataManagerStandardEventsType<T>;
    provider: IDataProvider;
    load(key: string): Promise<T | null>;
    save(key: string, data: T): Promise<boolean>;
    remove(key: string): Promise<boolean>;
}
