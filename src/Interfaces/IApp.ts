import { Locale } from 'locale-enum';
import { ILogger } from '../Interfaces';
import {
  AppStandardEventsType,
  ErrorTypeEnum,
  TranslationPluralItemType,
  AppCommonType,
} from '../Types';
import { IErrorHandler } from './IErrorHandler';

export interface IApp<T extends AppCommonType> {
  locale: Locale;
  fallbackLocale: Locale;

  config: T['config'];
  data: T['data'];
  debug: boolean;
  baseEvents: AppStandardEventsType<IApp<T>>;
  events?: T['events'];
  factories?: T['factories'];
  translations?: T['translations'];
  views?: T['views'];
  models?: T['models'];
  collections?: T['collections'];
  dataManagers?: T['dataManagers'];
  dataProviders?: T['dataProviders'];
  logger: ILogger;
  errorHandler: IErrorHandler;

  additionalLoggers: T['additionalLoggers'];
  additionalErrorHandlers: T['additionalErrorHandlers'];

  t(
    value: string | TranslationPluralItemType,
    data: Record<string, string>,
    number?: number,
  ): string;
  getCurrentLocale: () => Locale;
  setCurrentLocale(locale: Locale): boolean;
  isLocaleAvailable(locale: Locale): boolean;

  updateConfig(config: Partial<T['config']>): void;

  updateData(data: Partial<T['data']>): void;

  err(error: string): void;
  throwErr(error: string): void;
  warning(error: string): void;

  log(message: string, type: ErrorTypeEnum): void;
  info(message: string): void;

  isInitialized(): boolean;
  update(): void;
}
