import { IErrorHandler } from '../../../Interfaces';
import { ErrorTypeEnum } from '../../../Types/ErrorTypes';

export default class TestErrorHandler implements IErrorHandler {
  handleError(
    message: string,
    type: ErrorTypeEnum,
  ): { message: string; type: ErrorTypeEnum } {
    return {
      message,
      type,
    };
  }
}
