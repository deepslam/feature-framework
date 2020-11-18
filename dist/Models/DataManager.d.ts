import { IDataManager, IDataProvider } from '../Interfaces';
import { DataManagerStandardEventsType } from '../Types';
export default abstract class DataManager<T> implements IDataManager<T> {
    readonly events: DataManagerStandardEventsType<T>;
    protected abstract restore(data: unknown): T;
    protected abstract pack(data: T): unknown;
    abstract provider: IDataProvider;
    load(key: string): Promise<T | null>;
    save(key: string, data: T): Promise<boolean>;
    remove(key: string): Promise<boolean>;
}
