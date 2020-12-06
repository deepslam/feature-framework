import { Locale } from 'locale-enum';
import { IApp } from '../Interfaces';
import { TranslationItemType } from '../Types';

export type LocaleKey = keyof typeof Locale;

export default class Translations<T = TranslationItemType> {
  private app?: IApp<any>;
  constructor(
    private readonly translations: { [key in keyof typeof Locale]?: T } = {},
  ) {}

  static template(str: string, data: Record<string, string>): string {
    let s = str;
    for (const prop in data) {
      s = s.replace(new RegExp('{' + prop + '}', 'g'), data[prop]);
    }
    return s;
  }

  setApp(app: IApp<any>) {
    this.app = app;
  }

  get t(): T | null {
    if (!this.app) {
      return null;
    }
    if (this.translations[this.app.locale as LocaleKey]) {
      return this.translations[this.app.locale as LocaleKey]!;
    }
    if (this.translations[this.app.fallbackLocale as LocaleKey]) {
      return this.translations[this.app.fallbackLocale as LocaleKey]!;
    }

    return null;
  }
}

Object.defineProperty(Translations, 'translations', {
  get: (...args) => {
    console.log(args);
  },
});
