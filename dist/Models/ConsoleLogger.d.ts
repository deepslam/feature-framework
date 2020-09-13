import { ILogger } from '../Interfaces/ILogger';
import Application from '../Application/Application';
import { ErrorTypeEnum } from '../Types/ErrorTypes';
export default class ConsoleLogger implements ILogger {
    private readonly app;
    constructor(app: Application<unknown>);
    log(message: string, type?: ErrorTypeEnum | null): void;
}
