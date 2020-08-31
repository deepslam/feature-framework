// import AsyncStorage from '@react-native-community/async-storage';
import { IDataManager } from '../Interfaces/IDataManager';
import { IModel } from '../Interfaces/IModel';

import { LoadedModelType, ModelField } from '../Types';

export default class Model implements IModel {
  [key: string]: unknown;

  fields: Record<string, ModelField<unknown>> = {};

  protected static asyncStorageKey: string = '';

  public static restoreFromJSON<T extends typeof Model>(
    this: T,
    json: string,
  ): InstanceType<T> {
    const obj = JSON.parse(json);
    const model = new this();

    Object.keys(obj).forEach((key: string) => {
      if (Object.prototype.hasOwnProperty.call(model, key)) {
        model[key] = obj[key];
      }
    });

    return model as InstanceType<T>;
  }

  public static loadAsJSON<T extends typeof Model>(
    this: T,
  ): Promise<LoadedModelType<InstanceType<T>>> {
    return new Promise((resolve, reject) => {
      if (!this.asyncStorageKey) {
        reject(new Error('Model does not have a storage key'));
      }

      AsyncStorage.getItem(this.asyncStorageKey)
        .then((json: string) => {
          if (json) {
            resolve({
              instance: this.restoreFromJSON(json),
              isEmptyModel: false,
            });
          }

          resolve({
            instance: new this() as InstanceType<T>,
            isEmptyModel: true,
          });
        })
        .catch((e: Error) => reject(e));
    });
  }

  public static getAsyncStorageKey(): string | never {
    if (this.asyncStorageKey) return this.asyncStorageKey;

    throw new Error(
      `There is no async storage key in the model "${this.name}"`,
    );
  }

  public static saveAsJSON(manager: IDataManager): Promise<boolean> {
    return manager.saveAsJSON(this);
  }
}
