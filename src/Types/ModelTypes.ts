import { TypeCheckingRule, Rules, Errors } from 'validatorjs';

export type LoadedModelType<T> = {
  isEmptyModel: boolean;
  instance: T;
};

export type ModelValidationResultType = {
  is_passed: boolean;
  errors: Errors;
};

export type ModelValidationRule =
  | string
  | Array<string | TypeCheckingRule>
  | Rules;
