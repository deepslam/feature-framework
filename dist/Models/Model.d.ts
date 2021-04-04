import { ErrorMessages } from 'validatorjs';
import { IEvent, IModel, IDataManager } from '../Interfaces';
import { Constructor, ModelStandardEventsType, ModelValidationRule, ModelValidationResultType } from '../Types';
export default class Model<T = Record<string, unknown>> implements IModel<T> {
    fields: T;
    readonly baseEvents: ModelStandardEventsType<T>;
    protected customValidationMessages?: ErrorMessages;
    protected rules: Record<keyof T, ModelValidationRule>;
    events: Record<string, IEvent<unknown>>;
    readonly __class__: Constructor<this>;
    constructor(options: T);
    get defaultFieldValues(): Partial<T>;
    update(fields: Partial<T>): void;
    setValidationRules(rules: Record<keyof T, ModelValidationRule>): void;
    getValidationRules(): Record<keyof T, ModelValidationRule>;
    setValidationMessages(messages: ErrorMessages): void;
    validate(): ModelValidationResultType;
    save(dataManager: IDataManager<IModel<T>>, key: string): Promise<boolean>;
    load(dataManager: IDataManager<IModel<T>>, key: string): Promise<boolean>;
    setField<K extends keyof T>(key: K, value: T[K]): void;
    toJSON(): Partial<Record<keyof T, unknown>>;
    clone(): this;
}
