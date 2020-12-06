import { Locale } from 'locale-enum';

import {
  AppFeaturesType,
  AppStandardEventsType,
  AppCommonType,
  DefaultAppConfigType,
  ErrorTypeEnum,
  TranslationPluralItemType,
} from '../Types';

import { IApp, IErrorHandler, ILogger } from '../Interfaces';
import { ConsoleLogger, ErrorHandler, Translations } from '../Models';
import {
  AppErrorEvent,
  AppFeatureInitializedEvent,
  AppFeatureUpdatedEvent,
  AppLoadedEvent,
  AppLocaleChangedEvent,
  AppUpdatedEvent,
} from '../Events/App';

const privateFeatures = new Map();

export default abstract class Application<T extends AppCommonType>
  implements IApp<T> {
  private initialized = false;
  private locales: Locale[] = [Locale.en];
  public locale: Locale = Locale.en;
  public readonly fallbackLocale: Locale = Locale.en;
  public debug = false;
  public readonly baseEvents: AppStandardEventsType<T['config']> = {
    onAppLoaded: new AppLoadedEvent(),
    onAppError: new AppErrorEvent(),
    onAppLocaleChanged: new AppLocaleChangedEvent(),
    onUpdate: new AppUpdatedEvent(),
    onFeatureInitialized: new AppFeatureInitializedEvent(),
    onFeatureUpdated: new AppFeatureUpdatedEvent(),
  };
  public readonly logger: ILogger = new ConsoleLogger(this);
  public readonly errorHandler = new ErrorHandler();
  public additionalLoggers: ILogger[] = [];
  public additionalErrorHandlers: IErrorHandler[] = [];
  config: T['config'];
  events?: T['events'];
  factories?: T['factories'];
  translations?: T['translations'];
  views?: T['views'];
  models?: T['models'];
  collections?: T['collections'];
  dataManagers?: T['dataManagers'];
  dataProviders?: T['dataProviders'];

  constructor(
    data: Partial<T>,
    locales: Partial<DefaultAppConfigType> = {
      locales: [Locale.en],
      fallbackLocale: Locale.en,
      defaultLocale: Locale.en,
    },
  ) {
    this.locales = locales.locales || [Locale.en];
    this.fallbackLocale = locales.fallbackLocale || Locale.en;
    this.setCurrentLocale(locales.defaultLocale || Locale.en);

    this.config = {};
    this.events = {};
    this.collections = {};
    this.factories = {};
    this.views = {};
    this.models = {};
    this.dataManagers = {};
    this.translations = {};
    this.additionalErrorHandlers = [];
    this.additionalLoggers = [];
    privateFeatures.set(this, {});

    if (data) {
      this.setData(data);
    }
  }

  private setData(data: Partial<T>): boolean {
    if (this.isInitialized()) return false;
    if (data.features) {
      privateFeatures.set(this, data.features);
    }
    if (data.config) {
      this.config = data.config;
    }
    if (data.events) {
      this.events = data.events;
    }
    if (data.collections) {
      this.collections = data.collections;
    }
    if (data.factories) {
      this.factories = data.factories;
    }
    if (data.views) {
      this.views = data.views;
    }
    if (data.models) {
      this.models = data.models;
    }
    if (data.dataManagers) {
      this.dataManagers = data.dataManagers;
    }
    if (data.translations) {
      this.translations = data.translations;
    }
    if (data.additionalErrorHandlers) {
      this.additionalErrorHandlers = data.additionalErrorHandlers!;
    }
    if (data.additionalLoggers) {
      this.additionalLoggers = data.additionalLoggers!;
    }
    return true;
  }

  public extendConfig(config: Partial<T['config']>): void {
    this.config = { ...this.config, ...config };
    this.baseEvents.onUpdate.fire(this.config);
  }

  public setConfig<K extends keyof T['config']>(
    key: K,
    value: T['config'][K],
  ): void {
    this.config = {
      ...this.config,
      [key]: value,
    };
    this.baseEvents.onUpdate.fire(this.config);
  }

  features(): T['features'] {
    if (privateFeatures.has(this)) {
      return privateFeatures.get(this);
    }

    throw Error('Features are not defined for application!');
  }

  public setFeatures(features: T['features']): void {
    privateFeatures.set(this, features);
  }

  public init(data?: Partial<T>): Promise<ApplicationInitSuccessfulType> {
    return new Promise((resolve, reject) => {
      try {
        if (this.isInitialized()) {
          reject('App is already initialized!');
        }
        if (data) {
          this.setData(data);
        }
        const promises: Promise<boolean>[] = [];
        if (this.features()) {
          this.setAppToFeatures(this.features()!);
          Object.keys(this.features()!).forEach((key: string) => {
            promises.push(this.features()![key].init());
          });
        }
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

    if (this.translations) {
      setAppToTranslations(this.translations!);
    }
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

  setAppToFeatures(features: AppFeaturesType) {
    Object.keys(features).forEach((key) => {
      if (!features[key].hasApp()) {
        features[key].setApp(this);
        if (features[key].features) {
          this.setAppToFeatures(features[key].features);
        }
      }
    });
  }
}

export type ApplicationInitSuccessfulType = boolean;
export type ApplicationInitFailedType = { error: string };
