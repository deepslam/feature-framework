import { IDataManager } from '../Interfaces/IDataManager';
import { IModel } from '../Interfaces/IModel';

import { LoadedModelType, ModelField } from '../Types';

export default class Model implements IModel {
  [key: string]: unknown;

  fields: Record<string, ModelField<unknown>> = {};

  protected static asyncStorageKey: string = '';

  setFieldValue<K extends string>(key: K): void {
    throw new Error('Method not implemented.');
  }
  getFieldValue<K extends string>(key: K): void {
    throw new Error('Method not implemented.');
  }
}
