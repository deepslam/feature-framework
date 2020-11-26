import { IDataProvider } from '../../../Interfaces/IDataProvider';

export default class FailedDataProvider implements IDataProvider {
  save(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      reject();
    });
  }

  load(): Promise<unknown> {
    return new Promise((resolve, reject) => {
      reject();
    });
  }

  remove(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      reject();
    });
  }
}
