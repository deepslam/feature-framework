import { IApp, ILogger } from '../Interfaces';
import { ErrorTypeEnum } from '../Types';
export default class ConsoleLogger implements ILogger {
    private readonly app;
    constructor(app: IApp<any>);
    log(message: string, type?: ErrorTypeEnum | null): void;
}
