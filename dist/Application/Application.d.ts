import { TOptions } from 'i18next';
import { Store, Reducer } from '@reduxjs/toolkit';
import { CountryCodeType, TranslationType } from '../Types';
import { IApp, IFeature } from '../Interfaces';
import { AppLoadedEvent } from '../Events/App';
export default abstract class Application<C> implements IApp<C> {
    protected config: C;
    private initialized;
    private languages;
    private currentLanguage;
    store?: Store;
    readonly baseEvents: {
        onAppLoaded: AppLoadedEvent;
    };
    abstract readonly translations: TranslationType;
    abstract readonly features: Record<string, IFeature>;
    abstract readonly reducers: Record<string, Reducer>;
    constructor(config: C);
    cfg(): C;
    extendConfig(config: Partial<C>): void;
    init(): Promise<ApplicationInitSuccessfulType>;
    isInitialized(): boolean;
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
