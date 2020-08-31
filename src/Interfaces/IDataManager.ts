export interface IDataManager {
  load(key: string): Promise<string>;
  save<T>(key: string, data: T | T[] | Record<string, T>): Promise<boolean>;
}
