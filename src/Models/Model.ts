import AsyncStorage from '@react-native-community/async-storage';
import { IModel } from '../Interfaces/IModel';
import Application from '../Application/Application';

import { LoadedModelType, ModelField } from '../Types';

export default class Model implements IModel {
  [key: string]: unknown;

  fields: Record<string, ModelField<unknown>> = {};

  protected static asyncStorageKey: string = '';

  public static restoreFromJSON<T extends typeof AbstractModel>(
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

  public static load<T extends typeof AbstractModel>(
    this: T,
  ): Promise<LoadedModelType<InstanceType<T>>> {
    return new Promise((resolve, reject) => {
      if (!this.asyncStorageKey) {
        Application.error('Model does not have a storage key');
      }

      AsyncStorage.getItem(this.asyncStorageKey)
        .then((json) => {
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
        .catch((e) => reject(e));
    });
  }

  public static getAsyncStorageKey(): string | undefined {
    if (this.asyncStorageKey) return this.asyncStorageKey;

    return Application.error(
      `There is no async storage key in the model "${this.name}"`,
    );
  }

  public static save(): Promise<boolean> {
    return new Promise((resolve) => resolve(true));
  }
}
