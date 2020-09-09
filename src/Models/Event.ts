import { EventPrivateType } from '../Types';
import { IEvent } from '../Interfaces';

type FunctionType = (...args: any) => any;

const privateEvents: EventPrivateType<FunctionType> = new WeakMap<
  IEvent<unknown>,
  FunctionType[]
>();

export default class Event<T = unknown> implements IEvent<T> {
  subscribe(func: (item: T) => void) {
    if (privateEvents.has(this)) {
      const events = privateEvents.get(this);
      events?.push(func);
      if (events) {
        privateEvents.set(this, events);
      }
    } else {
      privateEvents.set(this, [func]);
    }
  }

  unsubscribe(func: (item: T) => void) {
    if (privateEvents.has(this)) {
      const events = privateEvents.get(this)!;
      if (events) {
        const filteredArray = events.filter((f) => f !== func)!;
        privateEvents.set(this, filteredArray);
      }
    }
  }

  fire(item: T) {
    if (privateEvents.has(this)) {
      privateEvents.get(this)!.forEach((func) => {
        func(item);
      });
    }
  }

  clear(): void {
    if (privateEvents.has(this)) {
      privateEvents.delete(this);
    }
  }
}
