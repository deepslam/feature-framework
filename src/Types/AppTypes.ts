import {
  IFeature,
  IEvent,
  IView,
  IModel,
  IDataCollection,
  IDataManager,
  IDataProvider,
  ILogger,
} from '../Interfaces';
import { Translations, Factory, ErrorHandler } from '../Models';
import { ConfigType } from '../Types';
import { Locale } from 'locale-enum';

export type DefaultAppConfigType = {
  fallbackLocale: Locale;
  locales: Locale[];
  defaultLocale: Locale;
};

export type AppConfig =
  | number
  | string
  | boolean
  | unknown[]
  | { [key: string]: AppConfig };

export type AppCommonType = {
  config?: Record<string, ConfigType>;
  events?: Record<string, IEvent<unknown>>;
  factories?: Record<string, Factory<any>>;
  views?: Record<string, IView<unknown>>;
  models?: Record<string, IModel<unknown>>;
  collections?: Record<string, IDataCollection<unknown>>;
  dataManagers?: Record<string, IDataManager<unknown>>;
  dataProviders?: Record<string, IDataProvider>;
  features?: Record<string, IFeature<any, any>>;
  translations?: Record<string, Translations<unknown>>;
  additionalLoggers?: ILogger[];
  additionalErrorHandlers?: ErrorHandler[];
};

export type AppFeaturesType = Record<string, IFeature<any, any>>;
