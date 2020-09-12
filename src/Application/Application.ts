import i18n, { TOptions } from 'i18next';
import {
  Store,
  configureStore,
  Reducer,
  combineReducers,
} from '@reduxjs/toolkit';

import { CountryCodeType, TranslationType, ErrorTypeEnum } from '../Types';

import { IApp, IFeature, ILogger } from '../Interfaces';
import { ConsoleLogger, ErrorHandler } from '../Models';
import { AppLoadedEvent, AppErrorEvent } from '../Events/App';

export default abstract class Application<C> implements IApp<C> {
  private initialized = false;
  private languages: CountryCodeType[] = [];
  private currentLanguage = 'en';
  public debug = false;
  public store?: Store;
  public readonly baseEvents: {
    onAppLoaded: AppLoadedEvent;
    onAppError: AppErrorEvent;
  } = {
    onAppLoaded: new AppLoadedEvent(),
    onAppError: new AppErrorEvent(),
  };
  public abstract readonly translations: TranslationType;
  public abstract readonly features: Record<string, IFeature>;
  public abstract readonly reducers: Record<string, Reducer>;
  public readonly logger: ILogger = new ConsoleLogger(this);
  public readonly errorHandler = new ErrorHandler();

  constructor(protected config: C) {}

  public cfg(): C {
    return this.config;
  }

  public extendConfig(config: Partial<C>): void {
    this.config = { ...this.config, ...config };
  }

  public init(): Promise<ApplicationInitSuccessfulType> {
    return new Promise((resolve, reject) => {
      if (this.isInitialized()) {
        reject();
      }
      this.setAppToFeatures(this.features);
      const promises: Promise<boolean>[] = [];
      Object.keys(this.features).forEach((key) => {
        promises.push(this.features[key].init());
      });
      this.initStore();
      this.initI18n()
        .then(() => Promise.all(promises))
        .then((args: boolean[]) => {
          const falseArgs = args.filter((arg) => !arg);
          if (falseArgs.length === 0) {
            this.initialized = true;
            this.baseEvents.onAppLoaded.fire(true);
            resolve(true);
          } else {
            this.baseEvents.onAppLoaded.fire(false);
            resolve(false);
          }
        })
        .catch(() => reject());
    });
  }

  isInitialized() {
    return this.initialized;
  }

  err(error: string): void {
    this.baseEvents.onAppError.fire({
      message: error,
      type: ErrorTypeEnum.error,
    });
  }

  throwErr(error: string): void {
    this.baseEvents.onAppError.fire({
      message: error,
      type: ErrorTypeEnum.error,
    });
  }

  warning(error: string): void {
    this.baseEvents.onAppError.fire({
      message: error,
      type: ErrorTypeEnum.warning,
    });
    this;
  }

  log(message: string, type: ErrorTypeEnum): void {
    this.logger.log(message, type);
  }

  public setAvailableLanguages(languages: CountryCodeType[]) {
    languages.forEach((lang) => {
      if (!this.languages.includes(lang.toLowerCase() as CountryCodeType)) {
        this.languages.push(lang.toLowerCase() as CountryCodeType);
      }
    });
  }

  public getAvailableLanguages() {
    return this.languages;
  }

  public isLanguageAvailable(language: CountryCodeType): boolean {
    return (
      this.languages.includes(language.toLowerCase() as CountryCodeType) ||
      this.currentLanguage.toLowerCase() === language.toLowerCase()
    );
  }

  public setCurrentLanguage(language: CountryCodeType): boolean {
    if (this.isLanguageAvailable(language as CountryCodeType)) {
      this.currentLanguage = language;
      return true;
    }

    return false;
  }

  public getCurrentLanguage() {
    return this.currentLanguage;
  }

  public t(key: string, data: TOptions): string {
    return i18n.t(key, data);
  }

  error(err: string): never {
    throw new Error(err);
  }

  protected initStore() {
    this.store = configureStore({ reducer: combineReducers(this.reducers) });
  }

  private initI18n(): Promise<boolean> {
    return new Promise((resolve) => {
      // i18n.use(initReactI18next).init(
      i18n.init(
        {
          fallbackLng: this.currentLanguage,
          debug: false,
        },
        (err) => {
          if (err) throw new Error(`Error with i18n initialization: ${err}`);
          resolve(true);
        },
      );
    });
  }

  private setAppToFeatures(features: Record<string, IFeature>) {
    Object.keys(features).forEach((key) => {
      if (!features[key].hasApp()) {
        features[key].setApp(this);
        if (features[key].features) {
          this.setAppToFeatures(features[key].features!);
        }
      }
    });
  }
}

export type ApplicationInitSuccessfulType = boolean;
export type ApplicationInitFailedType = { error: string };
