import { IDataProvider } from '../../../Interfaces/IDataProvider';

const data = new Map<string, unknown>();

export default class BrokenDataProvider implements IDataProvider {
  save(key: string, saveData: unknown): Promise<boolean> {
    throw Error('Error');
  }

  load(key: string): Promise<unknown> {
    throw Error('Error');
  }

  remove(key: string): Promise<boolean> {
    throw Error('Error');
  }
}
