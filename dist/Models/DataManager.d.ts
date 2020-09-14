import { IDataProvider } from './../Interfaces/IDataProvider';
import { IDataManager } from './../Interfaces/IDataManager';
import { IEvent } from './../Interfaces/IEvent';
export default abstract class DataManager<T> implements IDataManager<T> {
    readonly provider: IDataProvider;
    readonly events: {
        DataLoaded: IEvent<T>;
        DataLoadingError: IEvent<null>;
        DataSaved: IEvent<string>;
        DataSavingError: IEvent<string>;
        DataRemoved: IEvent<string>;
        DataRemovingError: IEvent<string>;
    };
    protected abstract restore(data: unknown): T;
    protected abstract pack(data: T): unknown;
    constructor(provider: IDataProvider);
    load(key: string): Promise<T | null>;
    save(key: string, data: T): Promise<boolean>;
    remove(key: string): Promise<boolean>;
}
