import { Locale } from 'locale-enum';

export type TranslationReplaceVariablesType = {
  replaceVariables(data: unknown): string;
};

export type TranslationPluralItemType = {
  zero: string;
  one: string;
  plural: string | ((n: number) => string);
};

export type TranslationItemType =
  | string
  | TranslationPluralItemType
  | { [key: string]: TranslationItemType };
