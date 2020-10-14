import { IDataProvider } from '../../../Interfaces/IDataProvider';

export default class BrokenDataProvider implements IDataProvider {
  save(): Promise<boolean> {
    throw Error('Error');
  }

  load(): Promise<unknown> {
    throw Error('Error');
  }

  remove(): Promise<boolean> {
    throw Error('Error');
  }
}
