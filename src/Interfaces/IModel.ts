export interface IModel<T = Record<string, unknown>> {
  fields: T;

  update(fields: Partial<T>): void;
}
