import { IDataProvider } from '../../../Interfaces/IDataProvider';

const data = new Map<string, unknown>();

export default class FailedDataProvider implements IDataProvider {
  save(key: string, saveData: unknown): Promise<boolean> {
    return new Promise((resolve, reject) => {
      reject();
    });
  }

  load(key: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      reject();
    });
  }

  remove(key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      reject();
    });
  }
}
