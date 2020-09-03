import { IModel } from '../Interfaces/IModel';
import { IEvent } from '../Interfaces/IEvent';
import ModelWasUpdatedEvent from '../Events/Models/ModelWasUpdatedEvent';

export default abstract class Model<T = Record<string, unknown>>
  implements IModel<T> {
  public fields: T;
  public readonly baseEvents: { updated: ModelWasUpdatedEvent<T> } = {
    updated: new ModelWasUpdatedEvent(),
  };
  abstract events: Record<string, IEvent<unknown>>;

  constructor(options: T) {
    this.fields = options;
  }

  update(fields: Partial<T>): void {
    this.fields = {
      ...this.fields,
      ...fields,
    };
    this.baseEvents.updated.fire(this);
  }
}
