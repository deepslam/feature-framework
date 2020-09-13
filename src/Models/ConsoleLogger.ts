import { ILogger } from '../Interfaces/ILogger';
import Application from '../Application/Application';
import { ErrorTypeEnum } from '../Types/ErrorTypes';

export default class ConsoleLogger implements ILogger {
  constructor(private readonly app: Application<unknown>) {}

  public log(message: string, type: ErrorTypeEnum | null = null): void {
    if (this.app.debug) {
      switch (type) {
        case ErrorTypeEnum.critical:
        case ErrorTypeEnum.error:
          console.error(message);
          break;
        case ErrorTypeEnum.warning:
        default:
          console.warn(message);
      }
    }
  }
}
