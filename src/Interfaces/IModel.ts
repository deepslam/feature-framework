import { IEvent } from './IEvent';
import { ModelStandardEventsType } from '../Types';

export interface IModel<T = Record<string, unknown>> {
  baseEvents: ModelStandardEventsType<T>;
  events: Record<string, IEvent<unknown>>;
  fields: T;

  update(fields: Partial<T>): void;
}
