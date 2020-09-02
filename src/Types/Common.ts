import { CountryCodeType } from './CountryCodeType';

export type Constructor<T = { new (...args: unknown[]): unknown }> = new (
  ...args: unknown[]
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

export type ComponentType<T, P> = {
  component: T;
  params: P;
};
