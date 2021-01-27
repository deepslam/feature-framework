import { IEvent } from './IEvent';
import { IDataManager } from '../Interfaces';
import {
  ModelStandardEventsType,
  ModelValidationRule,
  ModelValidationResultType,
} from '../Types';
import { ErrorMessages } from 'validatorjs';

export interface IModel<T = Record<string, unknown>> {
  baseEvents: ModelStandardEventsType<T>;
  events: Record<string, IEvent<unknown>>;
  fields: T;

  setValidationRules(rules: Record<keyof T, ModelValidationRule>): void;
  getValidationRules(): Record<keyof T, ModelValidationRule>;
  setValidationMessages(messages: ErrorMessages): void;
  validate(): ModelValidationResultType;

  save(dataManager: IDataManager<IModel<T>>, key: string): Promise<boolean>;
  load(dataManager: IDataManager<IModel<T>>, key: string): Promise<boolean>;

  update(fields: Partial<T>): void;
}
