import { TOptions } from 'i18next';
import { Store, Reducer } from '@reduxjs/toolkit';
import { CountryCodeType, TranslationType, ErrorTypeEnum } from '../Types';
import { IApp, IFeature, ILogger, IErrorHandler } from '../Interfaces';
import { ErrorHandler } from '../Models';
import { AppLoadedEvent, AppErrorEvent } from '../Events/App';
export default abstract class Application<C> implements IApp<C> {
    protected config: C;
    private initialized;
    private languages;
    private currentLanguage;
    debug: boolean;
    store?: Store;
    readonly baseEvents: {
        onAppLoaded: AppLoadedEvent;
        onAppError: AppErrorEvent;
    };
    abstract readonly translations: TranslationType;
    abstract readonly features: Record<string, IFeature>;
    abstract readonly reducers: Record<string, Reducer>;
    readonly logger: ILogger;
    readonly errorHandler: ErrorHandler;
    readonly additionalLoggers: ILogger[];
    readonly additionalErrorHandlers: IErrorHandler[];
    constructor(config: C);
    cfg(): C;
    extendConfig(config: Partial<C>): void;
    init(): Promise<ApplicationInitSuccessfulType>;
    isInitialized(): boolean;
    err(error: string): void;
    throwErr(error: string): void;
    warning(error: string): void;
    log(message: string, type?: ErrorTypeEnum): void;
    info(message: string): void;
    setAvailableLanguages(languages: CountryCodeType[]): void;
    getAvailableLanguages(): CountryCodeType[];
    isLanguageAvailable(language: CountryCodeType): boolean;
    setCurrentLanguage(language: CountryCodeType): boolean;
    getCurrentLanguage(): string;
    t(key: string, data: TOptions): string;
    error(err: string): never;
    protected initStore(): void;
    private initI18n;
    private setAppToFeatures;
}
export declare type ApplicationInitSuccessfulType = boolean;
export declare type ApplicationInitFailedType = {
    error: string;
};
