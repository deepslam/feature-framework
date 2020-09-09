import { IEvent } from '../Interfaces/IEvent';

export type EventPrivateType<T> = WeakMap<IEvent<unknown>, T[]>;
