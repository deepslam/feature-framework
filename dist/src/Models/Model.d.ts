import { IModel } from '../Interfaces/IModel';
import { IEvent } from '../Interfaces/IEvent';
import ModelWasUpdatedEvent from '../Events/Models/ModelWasUpdatedEvent';
export default abstract class Model<T = Record<string, unknown>> implements IModel<T> {
    fields: T;
    readonly baseEvents: {
        updated: ModelWasUpdatedEvent<T>;
    };
    abstract events: Record<string, IEvent<unknown>>;
    constructor(options: T);
    update(fields: Partial<T>): void;
    toJSON(): T;
}
