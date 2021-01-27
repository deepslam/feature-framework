import DataManagerDataLoadedEvent from '../Events/DataManager/DataManagerDataLoadedEvent';
import DataManagerDataSavedEvent from '../Events/DataManager/DataManagerDataSavedEvent';
import DataManagerDataRemovedEvent from '../Events/DataManager/DataManagerDataRemovedEvent';
import DataManagerDataLoadingErrorEvent from '../Events/DataManager/DataManagerDataLoadingErrorEvent';
import DataManagerDataSavingErrorEvent from '../Events/DataManager/DataManagerDataSavingErrorEvent';
import DataManagerDataRemovingErrorEvent from '../Events/DataManager/DataManagerDataRemovingErrorEvent';
import { IDataManager, IDataProvider } from '../Interfaces';
import { DataManagerStandardEventsType } from '../Types';

const ERR_PROVIDER_NOT_SET = 'Provider is not set';
const ERR_NO_LOAD_FUNC = 'Load function is not set';
const ERR_NO_SAVE_FUNC = 'Save function is not set';
const ERR_NO_REMOVE_FUNC = 'Remove function is not set';

export default abstract class DataManager<T> implements IDataManager<T> {
  public readonly events: DataManagerStandardEventsType<T> = {
    DataLoaded: new DataManagerDataLoadedEvent(),
    DataLoadingError: new DataManagerDataLoadingErrorEvent(),

    DataSaved: new DataManagerDataSavedEvent(),
    DataSavingError: new DataManagerDataSavingErrorEvent(),

    DataRemoved: new DataManagerDataRemovedEvent(),
    DataRemovingError: new DataManagerDataRemovingErrorEvent(),
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
        return resolve(null);
      }

      try {
        this.provider
          .load(key)
          .then((data: unknown) => {
            if (!data) {
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
            return reject(e);
          });
      } catch (e) {
        this.events.DataLoadingError.fire({
          key,
          message: e,
          result: false,
        });
        return reject(e);
      }
      return null;
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
            return resolve(result);
          })
          .catch((e) => {
            this.events.DataSavingError.fire({
              key,
              message: e,
              result: false,
            });
            return reject(e);
          });
      } catch (e) {
        this.events.DataSavingError.fire({
          key,
          message: e,
          result: false,
        });
        return reject(e);
      }
      return null;
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
            return resolve(result);
          })
          .catch((e) => {
            this.events.DataRemovingError.fire({
              message: ERR_NO_REMOVE_FUNC,
              key,
              result: false,
            });
            return reject(e);
          });
      } catch (e) {
        this.events.DataRemovingError.fire({
          message: ERR_NO_REMOVE_FUNC,
          key,
          result: false,
        });
        return reject(e);
      }
      return null;
    });
  }
}
