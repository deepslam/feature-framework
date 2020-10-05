import { IDataProvider } from '../Interfaces/IDataProvider';

const data = new Map<string, unknown>();

export default class DefaultDataProvider implements IDataProvider {
  save(key: string, saveData: unknown): Promise<boolean> {
    return new Promise((resolve) => {
      data.set(key, saveData);
      resolve(true);
    });
  }

  load(key: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      if (data.has(key)) {
        resolve(data.get(key));
      } else {
        reject();
      }
    });
  }

  remove(key: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (data.has(key)) {
        data.delete(key);
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }
}
