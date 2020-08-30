import { EventPrivateType } from '../Types';
import IEvent from '../Interfaces/IEvent';

const privateEvents: EventPrivateType<Function> = new WeakMap<
  IEvent<unknown>,
  Function[]
>();

export default class Event<T = unknown> implements IEvent<T> {
  subscribe(func: (item: T) => void) {
    if (privateEvents.has(this)) {
      const events = privateEvents.get(this);
      events?.push(func);
      privateEvents.set(this, events!);
    } else {
      privateEvents.set(this, [func]);
    }
  }
  unsubscribe(func: (item: T) => void) {
    if (privateEvents.has(this)) {
      const events = privateEvents.get(this)!;
      const filteredArray = events.filter((f) => f !== func)!;
      privateEvents.set(this, filteredArray);
    }
  }
  fire(item: T) {
    if (privateEvents.has(this)) {
      privateEvents.get(this)!.forEach((func) => {
        func(item);
      });
    }
  }
}
