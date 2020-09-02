import { IEvent } from './IEvent';

export interface IModel<T = Record<string, unknown>> {
  baseEvents: Record<string, IEvent<unknown>>;
  events: Record<string, IEvent<unknown>>;
  fields: T;

  update(fields: Partial<T>): void;
}
