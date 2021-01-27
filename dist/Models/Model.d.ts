import { IEvent, IModel, IDataManager } from '../Interfaces';
import { ModelStandardEventsType, ModelValidationRule, ModelValidationResultType } from '../Types';
export default class Model<T = Record<string, unknown>> implements IModel<T> {
    fields: T;
    readonly baseEvents: ModelStandardEventsType<T>;
    rules: Record<keyof T, ModelValidationRule>;
    events: Record<string, IEvent<unknown>>;
    constructor(options: T);
    get defaultFieldValues(): Partial<T>;
    update(fields: Partial<T>): void;
    setValidationRules(rules: Record<keyof T, ModelValidationRule>): void;
    getValidationRules(): Record<keyof T, ModelValidationRule>;
    validate(): ModelValidationResultType;
    save(dataManager: IDataManager<IModel<T>>, key: string): Promise<boolean>;
    load(dataManager: IDataManager<IModel<T>>, key: string): Promise<boolean>;
    setField<K extends keyof T>(key: K, value: T[K]): void;
    toJSON(): Partial<Record<keyof T, unknown>>;
}
