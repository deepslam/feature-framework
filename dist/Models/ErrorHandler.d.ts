import { IErrorHandler } from '../Interfaces';
import { ErrorTypeEnum } from '../Types';
export default class ErrorHandler implements IErrorHandler {
    handleError(message: string, type: ErrorTypeEnum): void;
}
