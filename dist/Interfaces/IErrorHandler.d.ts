import { ErrorTypeEnum } from '../Types/ErrorTypes';
export interface IErrorHandler {
    handleError(message: string, type: ErrorTypeEnum): unknown;
}
