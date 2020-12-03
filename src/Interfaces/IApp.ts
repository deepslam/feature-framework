import { Locale } from 'locale-enum';
import {
  IDataCollection,
  IDataManager,
  IDataProvider,
  IEvent,
  ILogger,
  IModel,
  IView,
} from '../Interfaces';
import {
  AppStandardEventsType,
  ConfigType,
  ErrorTypeEnum,
  TranslationPluralItemType,
} from '../Types';
import Factory from '../Models/Factory';
import { IErrorHandler } from './IErrorHandler';
import ErrorHandler from '../Models/ErrorHandler';
import Translations from '../Models/Translations';

export interface IApp<C = Record<string, ConfigType>> {
  locale: Locale;
  fallbackLocale: Locale;

  debug: boolean;
  baseEvents: AppStandardEventsType<C>;
  events?: Record<string, IEvent<unknown>>;
  factories?: Record<string, Factory<any>>;
  translations?: Record<string, Translations<unknown>>;
  views?: Record<string, IView<unknown>>;
  models?: Record<string, IModel<unknown>>;
  collections?: Record<string, IDataCollection<unknown>>;
  dataManagers?: Record<string, IDataManager<unknown>>;
  dataProviders?: Record<string, IDataProvider>;
  logger: ILogger;
  errorHandler: IErrorHandler;

  additionalLoggers: ILogger[];
  additionalErrorHandlers: ErrorHandler[];

  t(
    value: string | TranslationPluralItemType,
    data: Record<string, string>,
    number?: number,
  ): string;
  getCurrentLocale: () => Locale;
  setCurrentLocale(locale: Locale): boolean;
  isLocaleAvailable(locale: Locale): boolean;

  extendConfig(config: Partial<C>): void;

  err(error: string): void;
  throwErr(error: string): void;
  warning(error: string): void;

  log(message: string, type: ErrorTypeEnum): void;
  info(message: string): void;

  isInitialized(): boolean;
}
