export interface IDataManager {
  loadAsJSON(): Promise<string>;
  saveAsJSON<T>(data: T | T[] | Record<string, T>): Promise<boolean>;
}
