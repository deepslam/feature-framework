import { CountryCodeType } from './CountryCodeType';

export type Constructor<T = { new (...args: any[]): unknown }> = new (
  ...args: any[]
) => T;

export type TranslationItemType =
  | string
  | { [key: string]: TranslationItemType };

export type TranslationType = {
  [key in CountryCodeType]?: TranslationItemType;
};

export type ConfigType =
  | boolean
  | string
  | number
  | ConfigType[]
  | { [name: string]: ConfigType };
