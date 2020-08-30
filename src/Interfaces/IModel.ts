import { ModelField } from '../Types';

export interface IModel<F = Record<string, ModelField<unknown>>> {
  fields: F;

  setFieldValue<K extends keyof F>(key: K): void;
  getFieldValue<K extends keyof F>(key: K): void;
}
