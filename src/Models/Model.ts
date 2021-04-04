import Validator, { ErrorMessages } from 'validatorjs';
import { IEvent, IModel, IDataManager } from '../Interfaces';
import { ModelWasUpdatedEvent } from '../Events';
import Event from '../Models/Event';
import {
  Constructor,
  ModelStandardEventsType,
  ModelValidationRule,
  ModelValidationResultType,
} from '../Types';

export default class Model<T = Record<string, unknown>> implements IModel<T> {
  public fields: T;
  public readonly baseEvents: ModelStandardEventsType<T> = {
    onUpdate: new ModelWasUpdatedEvent(),
    onValidationFailed: new Event(),
    onValidationPassed: new Event(),
    onLoad: new Event(),
    onSave: new Event(),
  };
  protected customValidationMessages?: ErrorMessages;
  protected rules: Record<keyof T, ModelValidationRule> = {} as Record<
    keyof T,
    ModelValidationRule
  >;
  events: Record<string, IEvent<unknown>> = {};
  public readonly __class__: Constructor<this>;

  constructor(options: T) {
    this.__class__ = new.target as Constructor<this>;
    this.fields = {
      ...this.defaultFieldValues,
      ...options,
    };
  }

  get defaultFieldValues(): Partial<T> {
    return {};
  }

  update(fields: Partial<T>): void {
    this.fields = {
      ...this.fields,
      ...fields,
    };
    this.baseEvents.onUpdate.fire(this);
  }

  setValidationRules(rules: Record<keyof T, ModelValidationRule>): void {
    this.rules = {
      ...this.rules,
      ...rules,
    };
  }

  getValidationRules(): Record<keyof T, ModelValidationRule> {
    return this.rules;
  }

  setValidationMessages(messages: ErrorMessages): void {
    this.customValidationMessages = messages;
  }

  validate(): ModelValidationResultType {
    const validation = new Validator(
      this.fields,
      this.getValidationRules(),
      this.customValidationMessages,
    );
    const isValidationPassed = validation.passes() as boolean;

    if (isValidationPassed) {
      this.baseEvents.onValidationPassed.fire(this.fields);
    } else {
      this.baseEvents.onValidationFailed.fire({
        errors: validation.errors,
        fields: this.fields,
      });
    }

    return {
      is_passed: isValidationPassed,
      errors: validation.errors,
    };
  }

  save(dataManager: IDataManager<IModel<T>>, key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        dataManager
          .save(key, this)
          .then((result) => {
            this.baseEvents.onSave.fire(result);
            return resolve(result);
          })
          .catch((e) => reject(e));
      } catch (e) {
        reject(e);
      }
    });
  }

  load(dataManager: IDataManager<IModel<T>>, key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        dataManager
          .load(key)
          .then((item) => {
            if (item) {
              this.baseEvents.onLoad.fire(true);
              this.update(item.fields);
              return resolve(true);
            }
            this.baseEvents.onLoad.fire(false);
            return resolve(false);
          })
          .catch((e) => {
            reject(e);
          });
      } catch (e) {
        reject(e);
      }
    });
  }

  setField<K extends keyof T>(key: K, value: T[K]): void {
    const updatedValues = ({
      [key]: value,
    } as unknown) as Partial<T>;
    this.update(updatedValues);
  }

  toJSON(): Partial<Record<keyof T, unknown>> {
    return {
      ...this.fields,
    };
  }

  clone(): this {
    const clonedObject = new this.__class__(JSON.parse(JSON.stringify(this)));
    return clonedObject;
  }
}
