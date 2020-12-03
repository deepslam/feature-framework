import { IFeature } from '../Interfaces';
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

export type AppFeaturesType = Record<string, IFeature<any, any>>;
