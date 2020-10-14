import { IDataProvider } from './../Interfaces/IDataProvider';
import { IDataManager } from './../Interfaces/IDataManager';
import { IEvent } from './../Interfaces/IEvent';
import { DataManagerErrorsType } from 'Types';
export default abstract class DataManager<T> implements IDataManager<T> {
    readonly events: {
        DataLoaded: IEvent<T>;
        DataLoadingError: IEvent<DataManagerErrorsType>;
        DataSaved: IEvent<string>;
        DataSavingError: IEvent<DataManagerErrorsType>;
        DataRemoved: IEvent<string>;
        DataRemovingError: IEvent<DataManagerErrorsType>;
    };
    protected abstract restore(data: unknown): T;
    protected abstract pack(data: T): unknown;
    abstract provider: IDataProvider;
    load(key: string): Promise<T | null>;
    save(key: string, data: T): Promise<boolean>;
    remove(key: string): Promise<boolean>;
}
