import { Store, Reducer } from '@reduxjs/toolkit';
import { Locale } from 'locale-enum';
import { ErrorTypeEnum, DefaultAppConfigType, TranslationPluralItemType } from '../Types';
import { IApp, IFeature, ILogger, IErrorHandler } from '../Interfaces';
import { ErrorHandler, Translations } from '../Models';
import { AppLoadedEvent, AppErrorEvent, AppLocaleChangedEvent, AppUpdatedEvent } from '../Events/App';
export default abstract class Application<C> implements IApp<C> {
    config: C & Partial<DefaultAppConfigType>;
    private initialized;
    private locales;
    locale: Locale;
    readonly fallbackLocale: Locale;
    debug: boolean;
    store?: Store;
    readonly baseEvents: {
        onAppLoaded: AppLoadedEvent;
        onUpdate: AppUpdatedEvent<C>;
        onAppError: AppErrorEvent;
        onAppLocaleChanged: AppLocaleChangedEvent;
    };
    readonly translations: Record<string, Translations<unknown>>;
    abstract readonly features: Record<string, IFeature>;
    abstract readonly reducers: Record<string, Reducer>;
    readonly logger: ILogger;
    readonly errorHandler: ErrorHandler;
    readonly additionalLoggers: ILogger[];
    readonly additionalErrorHandlers: IErrorHandler[];
    constructor(config: C & Partial<DefaultAppConfigType>);
    extendConfig(config: Partial<C>): void;
    setConfig<K extends keyof C>(key: K, value: C[K]): void;
    init(): Promise<ApplicationInitSuccessfulType>;
    protected initStore(): void;
    private initTranslations;
    isInitialized(): boolean;
    err(error: string): void;
    throwErr(error: string): void;
    warning(error: string): void;
    log(message: string, type?: ErrorTypeEnum): void;
    info(message: string): void;
    setLocales(locales: Locale[]): void;
    getAvailableLocales(): Locale[];
    isLocaleAvailable(locale: Locale): boolean;
    setCurrentLocale(locale: Locale): boolean;
    getCurrentLocale(): Locale;
    t(value: string | TranslationPluralItemType, data?: Record<string, string>, number?: number): string;
    error(err: string): never;
    private setAppToFeatures;
}
export declare type ApplicationInitSuccessfulType = boolean;
export declare type ApplicationInitFailedType = {
    error: string;
};
