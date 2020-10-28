import { Locale } from 'locale-enum';
import { ErrorTypeEnum, DefaultAppConfigType, TranslationPluralItemType, ConfigType, AppFeaturesType } from '../Types';
import { IApp, ILogger, IErrorHandler } from '../Interfaces';
import { ErrorHandler, Translations } from '../Models';
import { AppLoadedEvent, AppErrorEvent, AppLocaleChangedEvent, AppUpdatedEvent } from '../Events/App';
export default abstract class Application<F extends AppFeaturesType, C extends Record<string, ConfigType>> implements IApp<C> {
    config: C & Partial<DefaultAppConfigType>;
    private initialized;
    private locales;
    locale: Locale;
    readonly fallbackLocale: Locale;
    debug: boolean;
    readonly baseEvents: {
        onAppLoaded: AppLoadedEvent;
        onUpdate: AppUpdatedEvent<C>;
        onAppError: AppErrorEvent;
        onAppLocaleChanged: AppLocaleChangedEvent;
    };
    readonly translations: Record<string, Translations<unknown>>;
    readonly logger: ILogger;
    readonly errorHandler: ErrorHandler;
    readonly additionalLoggers: ILogger[];
    readonly additionalErrorHandlers: IErrorHandler[];
    constructor(config: C & Partial<DefaultAppConfigType>);
    extendConfig(config: Partial<C>): void;
    setConfig<K extends keyof C>(key: K, value: C[K]): void;
    features(): F;
    init(features: F): Promise<ApplicationInitSuccessfulType>;
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
    setAppToFeatures(features: AppFeaturesType): void;
}
export declare type ApplicationInitSuccessfulType = boolean;
export declare type ApplicationInitFailedType = {
    error: string;
};
