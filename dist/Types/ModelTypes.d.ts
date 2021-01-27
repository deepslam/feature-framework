import { TypeCheckingRule, Rules, Errors } from 'validatorjs';
export declare type LoadedModelType<T> = {
    isEmptyModel: boolean;
    instance: T;
};
export declare type ModelValidationResultType = {
    is_passed: boolean;
    errors: Errors;
};
export declare type ModelValidationRule = string | Array<string | TypeCheckingRule> | Rules;
