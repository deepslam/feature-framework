import { IModel } from '../Interfaces/IModel';

export default abstract class Model<T = Record<string, unknown>>
  implements IModel<T> {
  public fields: T;

  constructor(options: T) {
    this.fields = options;
  }

  update(fields: Partial<T>): void {
    this.fields = {
      ...this.fields,
      ...fields,
    };
  }
}
