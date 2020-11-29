import { IModel, IEvent } from '../Interfaces';
import { ModelStandardEventsType } from '../Types';
export default abstract class Model<T = Record<string, unknown>> implements IModel<T> {
    fields: T;
    readonly baseEvents: ModelStandardEventsType<T>;
    events: Record<string, IEvent<unknown>>;
    constructor(options: T);
    update(fields: Partial<T>): void;
    setField<K extends keyof T>(key: K, value: T[K]): void;
    toJSON(): T;
}
