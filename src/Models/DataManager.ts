import { IDataManager } from './../Interfaces/IDataManager';

export default abstract class DataManager<T> implements IDataManager<T> {
  public abstract readonly key: string;

  load(): Promise<T | false>;
  save(data: T): Promise<boolean>;
}
