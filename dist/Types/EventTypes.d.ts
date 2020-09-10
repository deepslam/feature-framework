import { IEvent } from '../Interfaces/IEvent';
export declare type EventPrivateType<T> = WeakMap<IEvent<unknown>, T[]>;
