import { IEvent, IModel } from '../Interfaces';
import { ModelWasUpdatedEvent } from '../Events';
import { ModelStandardEventsType } from '../Types';

export default abstract class Model<T = Record<string, unknown>>
  implements IModel<T> {
  public fields: T;
  public readonly baseEvents: ModelStandardEventsType<T> = {
    updated: new ModelWasUpdatedEvent(),
  };
  events: Record<string, IEvent<unknown>> = {};

  constructor(options: T) {
    this.fields = {
      ...this.defaultFieldValues,
      ...options,
    };
  }

  get defaultFieldValues(): Partial<T> {
    return {};
  }

  update(fields: Partial<T>): void {
    this.fields = {
      ...this.fields,
      ...fields,
    };
    this.baseEvents.updated.fire(this);
  }

  setField<K extends keyof T>(key: K, value: T[K]): void {
    const updatedValues = ({
      [key]: value,
    } as unknown) as Partial<T>;
    this.update(updatedValues);
  }

  toJSON(): Partial<Record<keyof T, unknown>> {
    return {
      ...this.fields,
    };
  }
}
