import { Constructor } from '../Types/Common';
import { LoadedModelType } from '../Types/ModelTypes';
import { IDataManager } from '../Interfaces/IDataManager';
import Model from '../Models/Model';

function Saveable<T extends Constructor>(Base: T) {
  return class extends Base {
    storageKey: string;
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
      manager: IDataManager,
    ): Promise<LoadedModelType<InstanceType<T>>> {
      return new Promise((resolve, reject) => {
        if (!this.storageKey) {
          reject(new Error('Model does not have a storage key'));
        }

        manager
          .load()
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

    public static getStorageKey(): string | never {
      if (this.asyncStorageKey) return this.asyncStorageKey;

      throw new Error(
        `There is no async storage key in the model "${this.name}"`,
      );
    }

    public static saveAsJSON(manager: IDataManager): Promise<boolean> {
      return manager.saveAsJSON(this);
    }
  };
}
