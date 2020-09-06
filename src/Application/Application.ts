import i18n, { TOptions } from 'i18next';
import { pick } from 'dot-object';
import {
  Store,
  configureStore,
  Reducer,
  combineReducers,
} from '@reduxjs/toolkit';

import { CountryCodeType, TranslationType } from '../Types';

import { IApp, IFeature } from '../Interfaces';

export default abstract class Application<C> implements IApp<C> {
  private initialized = false;
  private languages: CountryCodeType[] = [];
  private currentLanguage = 'en';
  public store?: Store;
  public readonly baseEvents = {};
  public abstract readonly translations: TranslationType;
  public abstract readonly features: Record<string, IFeature>;
  public abstract readonly reducers: Record<string, Reducer>;

  constructor(readonly config: C) {}

  getConfig(): C {
    return this.config;
  }

  public init(): Promise<ApplicationInitSuccessfulType> {
    return new Promise((resolve, reject) => {
      if (this.isInitialized) {
        reject();
      }
      const promises: Promise<boolean>[] = [];
      Object.keys(this.features).forEach((key) => {
        promises.push(this.features[key].init());
      });
      this.initStore();
      this.initI18n()
        .then(() => Promise.all(promises))
        .then((args: boolean[]) => {
          const falseArgs = args.filter((arg) => !arg);
          if (falseArgs.length === 0) {
            this.initialized = true;
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch(() => reject());
    });
  }

  get isInitialized() {
    return this.initialized;
  }

  public setAvailableLanguages(languages: CountryCodeType[]) {
    languages.forEach((lang) => {
      if (!this.languages.includes(lang.toLowerCase() as CountryCodeType)) {
        this.languages.push(lang.toLowerCase() as CountryCodeType);
      }
    });
  }

  public getAvailableLanguages() {
    return this.languages;
  }

  public isLanguageAvailable(language: CountryCodeType): boolean {
    return (
      this.languages.includes(language.toLowerCase() as CountryCodeType) ||
      this.currentLanguage.toLowerCase() === language.toLowerCase()
    );
  }

  public setCurrentLanguage(language: CountryCodeType): boolean {
    if (this.isLanguageAvailable(language as CountryCodeType)) {
      this.currentLanguage = language;
      return true;
    }

    return false;
  }

  public getCurrentLanguage() {
    return this.currentLanguage;
  }

  public t(key: string, data: TOptions): string {
    return i18n.t(key, data);
  }

  public cfg(path: string): unknown {
    return pick(path, this.config);
  }

  error(err: string): never {
    throw new Error(err);
  }

  protected initStore() {
    this.store = configureStore({ reducer: combineReducers(this.reducers) });
  }

  private initI18n(): Promise<boolean> {
    return new Promise((resolve) => {
      // i18n.use(initReactI18next).init(
      i18n.init(
        {
          fallbackLng: this.currentLanguage,
          debug: false,
        },
        (err) => {
          if (err) throw new Error(`Error with i18n initialization: ${err}`);
          resolve(true);
        },
      );
    });
  }
}

export type ApplicationInitSuccessfulType = boolean;
export type ApplicationInitFailedType = { error: string };
