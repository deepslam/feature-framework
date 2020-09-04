import DataLoadedEvent from '../Events/DataManager/DataLoadedEvent';
import DataSavedEvent from '../Events/DataManager/DataSavedEvent';
import DataLoadingErrorEvent from '../Events/DataManager/DataLoadingErrorEvent';
import DataSavingErrorEvent from '../Events/DataManager/DataSavingErrorEvent';
import { IDataProvider } from './../Interfaces/IDataProvider';
import { IDataManager } from './../Interfaces/IDataManager';
import { IEvent } from './../Interfaces/IEvent';

export default abstract class DataManager<T> implements IDataManager<T> {
  public abstract readonly key: string;
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

  load(dataProvider: IDataProvider): Promise<T | null> {
    return new Promise((resolve, reject) => {
      dataProvider
        .load(this.key)
        .then((data: unknown) => {
          let result = null;
          if (typeof data === 'string') {
            result = JSON.parse(data) as T;
          } else {
            result = data;
          }
          this.events.DataLoaded.fire(result as T);
          resolve(result as T);
        })
        .catch(() => {
          this.events.DataLoadingError.fire(null);
          reject(null);
        });
    });
  }

  save(dataProvider: IDataProvider, data: T): Promise<boolean> {
    return new Promise((resolve, reject) => {
      dataProvider
        .save(this.key, data)
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
