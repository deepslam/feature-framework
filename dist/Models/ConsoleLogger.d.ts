import { ConfigType } from 'Types';
import { ILogger, IApp } from '../Interfaces';
import { ErrorTypeEnum } from '../Types/ErrorTypes';
export default class ConsoleLogger implements ILogger {
    private readonly app;
    constructor(app: IApp<Record<string, ConfigType>>);
    log(message: string, type?: ErrorTypeEnum | null): void;
}
