import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { pick } from 'dot-object';
import { Store, configureStore, Reducer, Slice } from '@reduxjs/toolkit';

import { AppFeatures, AppReducers, AppConfig, AppInitParams } from '../Types';

import IApp from '../Interfaces/IApp';

class Application<F = AppFeatures, R = AppReducers, C = AppConfig>
  implements IApp {
  private initialized: boolean = false;

  private languages: string[] = [];
  private currentLanguage = 'en';
  private translations: Record<string, object> = {};

  constructor(readonly features: F, readonly reducers: R, readonly config: C) {}

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

  public setAvailableLanguages(languages: string[]) {
    languages.forEach((lang) => {
      if (!this.languages.includes(lang.toLowerCase())) {
        this.languages.push(lang.toLowerCase());
      }
    });
  }

  public getAvailableLanguages() {
    return this.languages;
  }

  public isLanguageAvailable(language: string): boolean {
    return (
      this.languages.includes(language.toLowerCase()) ||
      this.currentLanguage.toLowerCase() === language.toLowerCase()
    );
  }

  public setCurrentLanguage(language: string): boolean {
    if (this.isLanguageAvailable(language)) {
      this.currentLanguage = language;
      return true;
    }

    return false;
  }

  public getCurrentLanguage() {
    return this.currentLanguage;
  }

  public t(key: string, data: object = {}): string {
    return i18n.t(key, data);
  }

  public cfg(path: string): object | number | string {
    return pick(path, this.config);
  }

  error(err: string): never {
    throw new Error(err);
  }

  private initStore() {
    let reducers: Record<string, Reducer> = {};
    Object.keys(this.features).forEach((featureKey) => {
      if (this.features[featureKey] && this.features[featureKey].hasSlice()) {
        Object.keys(this.features[featureKey].getSlice()).forEach(
          (sliceKey) => {
            const key = `${featureKey}/${sliceKey}`;
            reducers = {
              ...reducers,
              [key]: this.features[featureKey].getSlice()[sliceKey]!.reducer,
            };
          },
        );
      }
    });
    this.store = configureStore({ reducer: reducers });
  }

  public getStore() {
    return this.store;
  }

  private initI18n(): Promise<boolean> {
    return new Promise((resolve) => {
      i18n.use(initReactI18next).init(
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

export function createApp<F = AppFeatures, R = AppReducers, C = Config>(
  options: AppInitParams<F, R, C>,
): Application<F, R, C> {
  return new Application<F, R, C>(
    options.features,
    options.reducers,
    options.config,
  );
}

export type ApplicationInitSuccessfulType = boolean;
export type ApplicationInitFailedType = { error: string };
