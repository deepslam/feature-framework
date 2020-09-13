import { ErrorTypeEnum } from '../Types/ErrorTypes';
export interface ILogger {
    log(err: string, type: ErrorTypeEnum | null): void;
}
