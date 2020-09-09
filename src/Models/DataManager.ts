import DataLoadedEvent from '../Events/DataManager/DataLoadedEvent';
import DataSavedEvent from '../Events/DataManager/DataSavedEvent';
import DataLoadingErrorEvent from '../Events/DataManager/DataLoadingErrorEvent';
import DataSavingErrorEvent from '../Events/DataManager/DataSavingErrorEvent';
import { IDataProvider } from './../Interfaces/IDataProvider';
import { IDataManager } from './../Interfaces/IDataManager';
import { IEvent } from './../Interfaces/IEvent';

export default abstract class DataManager<T> implements IDataManager<T> {
  public readonly events: {
    DataLoaded: IEvent<T>;
    DataLoadingError: IEvent<null>;
    DataSaved: IEvent<boolean>;
    DataSavingError: IEvent<boolean>;
  } = {
    DataLoaded: new DataLoadedEvent(),
    DataLoadingError: new DataLoadingErrorEvent(),
    DataSaved: new DataSavedEvent(),
    DataSavingError: new DataSavingErrorEvent(),
  };

  protected abstract restore(data: unknown): T;
  protected abstract pack(data: T): unknown;

  constructor(public readonly provider: IDataProvider) {}

  load(key: string): Promise<T | null> {
    return new Promise((resolve, reject) => {
      this.provider
        .load(key)
        .then((data: unknown) => {
          const result = this.restore(data) as T;
          this.events.DataLoaded.fire(result);
          resolve(result as T);
        })
        .catch(() => {
          this.events.DataLoadingError.fire(null);
          reject(null);
        });
    });
  }

  save(key: string, data: T): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const dataToSave = this.pack(data);
      this.provider
        .save(key, dataToSave)
        .then(() => {
          this.events.DataSaved.fire(true);
          resolve(true);
        })
        .catch(() => {
          this.events.DataSavingError.fire(false);
          reject(false);
        });
    });
  }
}
