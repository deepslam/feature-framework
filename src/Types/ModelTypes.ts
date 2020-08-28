export type ModelField<C> = C;

export type LoadedModelType<T> = {
  isEmptyModel: boolean;
  instance: T;
};
