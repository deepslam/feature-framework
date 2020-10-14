import DataLoadedEvent from '../Events/DataManager/DataLoadedEvent';
import DataSavedEvent from '../Events/DataManager/DataSavedEvent';
import DataRemovedEvent from '../Events/DataManager/DataRemovedEvent';
import DataLoadingErrorEvent from '../Events/DataManager/DataLoadingErrorEvent';
import DataSavingErrorEvent from '../Events/DataManager/DataSavingErrorEvent';
import DataRemovingErrorEvent from '../Events/DataManager/DataRemovingErrorEvent';
import { IDataProvider } from './../Interfaces/IDataProvider';
import { IDataManager } from './../Interfaces/IDataManager';
import { IEvent } from './../Interfaces/IEvent';
import { DataManagerErrorsType } from 'Types';

const ERR_PROVIDER_NOT_SET = 'Provider is not set';
const ERR_NO_LOAD_FUNC = 'Load function is not set';
const ERR_NO_SAVE_FUNC = 'Save function is not set';
const ERR_NO_REMOVE_FUNC = 'Remove function is not set';

export default abstract class DataManager<T> implements IDataManager<T> {
  public readonly events: {
    DataLoaded: IEvent<T>;
    DataLoadingError: IEvent<DataManagerErrorsType>;

    DataSaved: IEvent<string>;
    DataSavingError: IEvent<DataManagerErrorsType>;

    DataRemoved: IEvent<string>;
    DataRemovingError: IEvent<DataManagerErrorsType>;
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
        this.events.DataLoadingError.fire({
          message: ERR_PROVIDER_NOT_SET,
          key,
          result: false,
        });
        throw new Error(ERR_PROVIDER_NOT_SET);
      }
      if (!this.provider.load) {
        this.events.DataLoadingError.fire({
          message: ERR_NO_LOAD_FUNC,
          key,
          result: false,
        });
        resolve(null);
      }

      try {
        this.provider
          .load(key)
          .then((data: unknown) => {
            if (data === null) {
              return resolve(null);
            }

            const result = this.restore(data) as T;
            this.events.DataLoaded.fire(result);
            return resolve(result as T);
          })
          .catch((e) => {
            this.events.DataLoadingError.fire({
              key,
              message: e,
              result: false,
            });
            reject(e);
          });
      } catch (e) {
        this.events.DataLoadingError.fire({
          key,
          message: e,
          result: false,
        });
        reject(e);
      }
    });
  }

  save(key: string, data: T): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.provider) {
        this.events.DataSavingError.fire({
          message: ERR_PROVIDER_NOT_SET,
          key,
          result: false,
        });
        throw new Error(ERR_PROVIDER_NOT_SET);
      }
      if (!this.provider.save) {
        this.events.DataSavingError.fire({
          message: ERR_NO_SAVE_FUNC,
          key,
          result: false,
        });
        throw new Error(ERR_NO_SAVE_FUNC);
      }

      try {
        const dataToSave = this.pack(data);
        this.provider
          .save(key, dataToSave)
          .then((result) => {
            if (result) {
              this.events.DataSaved.fire(key);
            }
            resolve(result);
          })
          .catch((e) => {
            this.events.DataSavingError.fire({
              key,
              message: e,
              result: false,
            });
            reject(e);
          });
      } catch (e) {
        this.events.DataSavingError.fire({
          key,
          message: e,
          result: false,
        });
        reject(e);
      }
    });
  }

  remove(key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.provider) {
        this.events.DataRemovingError.fire({
          result: false,
          message: ERR_PROVIDER_NOT_SET,
          key,
        });
        throw new Error(ERR_PROVIDER_NOT_SET);
      }
      if (!this.provider.remove) {
        this.events.DataRemovingError.fire({
          message: ERR_NO_REMOVE_FUNC,
          key,
          result: false,
        });
        throw new Error(ERR_NO_REMOVE_FUNC);
      }

      try {
        this.provider
          .remove(key)
          .then((result) => {
            if (result) {
              this.events.DataRemoved.fire(key);
            } else {
              this.events.DataRemovingError.fire({
                key,
                result: false,
              });
            }
            resolve(result);
          })
          .catch((e) => {
            this.events.DataRemovingError.fire({
              message: ERR_NO_REMOVE_FUNC,
              key,
              result: false,
            });
            reject(e);
          });
      } catch (e) {
        this.events.DataRemovingError.fire({
          message: ERR_NO_REMOVE_FUNC,
          key,
          result: false,
        });
        reject(e);
      }
    });
  }
}
