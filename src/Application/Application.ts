import {
  Store,
  configureStore,
  Reducer,
  combineReducers,
} from '@reduxjs/toolkit';
import { Locale } from 'locale-enum';

import {
  ErrorTypeEnum,
  DefaultAppConfigType,
  TranslationPluralItemType,
} from '../Types';

import { IApp, IFeature, ILogger, IErrorHandler } from '../Interfaces';
import { ConsoleLogger, ErrorHandler, Translations } from '../Models';
import {
  AppLoadedEvent,
  AppErrorEvent,
  AppLocaleChangedEvent,
  AppUpdatedEvent,
} from '../Events/App';

export default abstract class Application<C> implements IApp<C> {
  private initialized = false;
  private locales: Locale[] = [Locale.en];
  public locale: Locale = Locale.en;
  public readonly fallbackLocale: Locale = Locale.en;
  public debug = false;
  public store?: Store;
  public readonly baseEvents: {
    onAppLoaded: AppLoadedEvent;
    onUpdate: AppUpdatedEvent<C>;
    onAppError: AppErrorEvent;
    onAppLocaleChanged: AppLocaleChangedEvent;
  } = {
    onAppLoaded: new AppLoadedEvent(),
    onAppError: new AppErrorEvent(),
    onAppLocaleChanged: new AppLocaleChangedEvent(),
    onUpdate: new AppUpdatedEvent(),
  };
  public readonly translations: Record<string, Translations<unknown>> = {};
  public abstract readonly features: Record<string, IFeature>;
  public abstract readonly reducers: Record<string, Reducer>;
  public readonly logger: ILogger = new ConsoleLogger(this);
  public readonly errorHandler = new ErrorHandler();
  public readonly additionalLoggers: ILogger[] = [];
  public readonly additionalErrorHandlers: IErrorHandler[] = [];

  constructor(public config: C & Partial<DefaultAppConfigType>) {
    this.locales = config.locales || [Locale.en];
    this.fallbackLocale = config.fallbackLocale || Locale.en;
    this.setCurrentLocale(config.defaultLocale || Locale.en);
  }

  public extendConfig(config: Partial<C>): void {
    this.config = { ...this.config, ...config };
    this.baseEvents.onUpdate.fire(this.config);
  }

  public setConfig<K extends keyof C>(key: K, value: C[K]): void {
    this.config = {
      ...this.config,
      [key]: value,
    };
    this.baseEvents.onUpdate.fire(this.config);
  }

  public init(): Promise<ApplicationInitSuccessfulType> {
    return new Promise((resolve, reject) => {
      try {
        if (this.isInitialized()) {
          reject('App is already initialized!');
        }
        this.setAppToFeatures(this.features);
        this.initStore();
        const promises: Promise<boolean>[] = [];
        Object.keys(this.features).forEach((key) => {
          promises.push(this.features[key].init());
        });
        this.initTranslations();
        Promise.all(promises)
          .then((args: boolean[]) => {
            const falseArgs = args.filter((arg) => !arg);
            if (falseArgs.length === 0) {
              this.initialized = true;
              this.baseEvents.onAppLoaded.fire(true);
              resolve(true);
            } else {
              this.throwErr('App initialization failed');
              this.baseEvents.onAppLoaded.fire(false);
              resolve(false);
            }
          })
          .catch((e) => {
            this.throwErr(
              `Unexpected error happened during app initialization (${e})`,
            );
            reject(
              `Unexpected error happened during app initialization (${e})`,
            );
          });
      } catch (e) {
        reject(e);
      }
    });
  }

  protected initStore() {
    this.store = configureStore({ reducer: combineReducers(this.reducers) });
  }

  private initTranslations(): void {
    const setAppToTranslations = (
      translations: Record<string, Translations<unknown>>,
    ) => {
      Object.keys(translations).forEach((translationKey) => {
        const translation = translations[translationKey];
        if (translation instanceof Translations) {
          translation.setApp(this);
        } else if (
          typeof translation === 'object' &&
          Object.keys(translation).length > 0
        ) {
          setAppToTranslations(translation);
        }
      });
    };

    setAppToTranslations(this.translations);
  }

  isInitialized() {
    return this.initialized;
  }

  err(error: string): void {
    this.baseEvents.onAppError.fire({
      message: error,
      type: ErrorTypeEnum.error,
    });
    this.log(error, ErrorTypeEnum.error);
    this.errorHandler.handleError(error, ErrorTypeEnum.error);
    this.additionalErrorHandlers.forEach((handler) =>
      handler.handleError(error, ErrorTypeEnum.error),
    );
  }

  throwErr(error: string): void {
    this.baseEvents.onAppError.fire({
      message: error,
      type: ErrorTypeEnum.critical,
    });
    this.log(error, ErrorTypeEnum.critical);
    this.errorHandler.handleError(error, ErrorTypeEnum.critical);
    this.additionalErrorHandlers.forEach((handler) =>
      handler.handleError(error, ErrorTypeEnum.critical),
    );
  }

  warning(error: string): void {
    this.baseEvents.onAppError.fire({
      message: error,
      type: ErrorTypeEnum.warning,
    });
    this.log(error, ErrorTypeEnum.warning);
    this.errorHandler.handleError(error, ErrorTypeEnum.warning);
    this.additionalErrorHandlers.forEach((handler) =>
      handler.handleError(error, ErrorTypeEnum.warning),
    );
  }

  log(message: string, type: ErrorTypeEnum = ErrorTypeEnum.warning): void {
    this.logger.log(message, type);
    this.additionalLoggers.forEach((logger) => logger.log(message, type));
  }

  info(message: string): void {
    this.log(message, ErrorTypeEnum.info);
  }

  public setLocales(locales: Locale[]) {
    locales.forEach((locale) => {
      if (!this.locales.includes(locale)) {
        this.locales.push(locale);
      }
    });
  }

  public getAvailableLocales() {
    return this.locales;
  }

  public isLocaleAvailable(locale: Locale): boolean {
    return (
      this.locales.includes(locale) || this.locale.toLowerCase() === locale
    );
  }

  public setCurrentLocale(locale: Locale): boolean {
    if (this.isLocaleAvailable(locale)) {
      this.locale = locale;
      this.baseEvents.onAppLocaleChanged.fire(locale);
      return true;
    }

    return false;
  }

  public getCurrentLocale() {
    return this.locale;
  }

  public t(
    value: string | TranslationPluralItemType,
    data: Record<string, string> = {},
    number?: number,
  ): string {
    if (typeof value === 'string') {
      return Translations.template(
        value,
        (data as Record<string, string>) || {},
      );
    } else if (
      typeof value === 'object' &&
      value.plural &&
      value.one &&
      value.zero
    ) {
      const params: Record<string, string> = data || {};
      if (number === 0) {
        return Translations.template(value.zero, params);
      } else if (number === 1) {
        return Translations.template(value.one, params);
      } else if (number && number > 1) {
        if (typeof value.plural === 'string') {
          return Translations.template(value.plural, params);
        } else {
          return Translations.template(value.plural(number), params);
        }
      } else {
        return '';
      }
    }
    return '';
  }

  error(err: string): never {
    throw new Error(err);
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
