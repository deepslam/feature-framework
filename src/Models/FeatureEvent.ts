import { IFeature } from '../Interfaces';
import { EventPrivateType } from '../Types';
import IEvent from '../Interfaces/IEvent';

const privateEvents: EventPrivateType<Function> = new WeakMap<
  IEvent<unknown>,
  Function[]
>();

export abstract class FeatureEvent<T = unknown> implements IEvent<T> {
  subscribe(func: (item: T) => void) {
    if (privateEvents.has(this)) {
      privateEvents.set([...privateEvents.get(this), func]);
    } else {
      privateEvents.set([func]);
    }
  }
  unsubscribe() {}
  fire(item: T) {
    if (privateEvents.has(this)) {
      privateEvents.get(this)!.forEach((func) => {
        func(item);
      });
    }
  }
}
