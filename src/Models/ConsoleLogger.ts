import { ConfigType } from 'Types';
import { ILogger, IApp } from '../Interfaces';
import { ErrorTypeEnum } from '../Types/ErrorTypes';

export default class ConsoleLogger implements ILogger {
  constructor(private readonly app: IApp<Record<string, ConfigType>>) {}

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
