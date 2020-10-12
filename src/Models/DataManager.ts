import DataLoadedEvent from '../Events/DataManager/DataLoadedEvent';
import DataSavedEvent from '../Events/DataManager/DataSavedEvent';
import DataRemovedEvent from '../Events/DataManager/DataRemovedEvent';
import DataLoadingErrorEvent from '../Events/DataManager/DataLoadingErrorEvent';
import DataSavingErrorEvent from '../Events/DataManager/DataSavingErrorEvent';
import DataRemovingErrorEvent from '../Events/DataManager/DataRemovingErrorEvent';
import { IDataProvider } from './../Interfaces/IDataProvider';
import { IDataManager } from './../Interfaces/IDataManager';
import { IEvent } from './../Interfaces/IEvent';

export default abstract class DataManager<T> implements IDataManager<T> {
  public readonly events: {
    DataLoaded: IEvent<T>;
    DataLoadingError: IEvent<null>;

    DataSaved: IEvent<string>;
    DataSavingError: IEvent<string>;

    DataRemoved: IEvent<string>;
    DataRemovingError: IEvent<string>;
  } = {
    DataLoaded: new DataLoadedEvent(),
    DataLoadingError: new DataLoadingErrorEvent(),

    DataSaved: new DataSavedEvent(),
    DataSavingError: new DataSavingErrorEvent(),

    DataRemoved: new DataRemovedEvent(),
    DataRemovingError: new DataRemovingErrorEvent(),
  };

  protected abstract restore(data: unknown): T;
  protected abstract pack(data: T): unknown;
  public abstract provider: IDataProvider;

  load(key: string): Promise<T | null> {
    return new Promise((resolve, reject) => {
      if (!this.provider) {
        this.events.DataLoadingError.fire(null);
        reject(null);
      }
      if (!this.provider.load) {
        this.events.DataLoadingError.fire(null);
        reject(null);
      }

      this.provider
        .load(key)
        .then((data: unknown) => {
          if (data === null) {
            this.events.DataLoadingError.fire(null);
            reject(null);
          }

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
      if (!this.provider) {
        this.events.DataSavingError.fire(key);
        reject(null);
      }
      if (!this.provider.save) {
        this.events.DataSavingError.fire(key);
        reject(null);
      }

      const dataToSave = this.pack(data);
      this.provider
        .save(key, dataToSave)
        .then(() => {
          this.events.DataSaved.fire(key);
          resolve(true);
        })
        .catch(() => {
          this.events.DataSavingError.fire(key);
          reject(false);
        });
    });
  }

  remove(key: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.provider
        .remove(key)
        .then((result) => {
          if (result) {
            this.events.DataRemoved.fire(key);
          } else {
            this.events.DataRemovingError.fire(key);
          }
          resolve(result);
        })
        .catch(() => {
          this.events.DataRemovingError.fire(key);
          resolve(false);
        });
    });
  }
}
