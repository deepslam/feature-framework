import { Locale } from 'locale-enum';
import { IFeature, IApp } from '../Interfaces';
import { ConfigType } from './Common';

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

export type AppFeaturesType = Record<
  string,
  IFeature<Record<string, ConfigType>, IApp>
>;
