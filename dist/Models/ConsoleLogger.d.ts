import { IApp, ILogger } from '../Interfaces';
import { ConfigType, ErrorTypeEnum } from '../Types';
export default class ConsoleLogger implements ILogger {
    private readonly app;
    constructor(app: IApp<Record<string, ConfigType>>);
    log(message: string, type?: ErrorTypeEnum | null): void;
}
