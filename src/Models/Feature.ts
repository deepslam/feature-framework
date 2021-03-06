/* eslint-disable consistent-return */
/* eslint-disable indent */
import { v4 as uuid4 } from 'uuid';
import {
  FeatureDataUpdatedEvent,
  FeatureErrorEvent,
  FeatureInitializedEvent,
  FeatureUpdatedEvent,
} from '../Events/Features';
import { IApp, IFeature } from '../Interfaces';
import Translations from '../Models/Translations';
import { FeatureCommonType, FeatureStandardEventsType } from '../Types';

type AbstractFeaturePrivateDataType = {
  initialized: boolean;
};

const privateData = new Map<string, Partial<AbstractFeaturePrivateDataType>>();
const appData = new Map<string, IApp<any>>();

export default abstract class Feature<
  F extends FeatureCommonType,
  A extends IApp<any>
> implements IFeature<F, A> {
  public abstract name: string;
  public readonly uuid: string;
  public readonly baseEvents: FeatureStandardEventsType<IFeature<F, A>> = {
    initialized: new FeatureInitializedEvent(),
    onError: new FeatureErrorEvent(),
    onUpdate: new FeatureUpdatedEvent(),
    onDataUpdate: new FeatureDataUpdatedEvent(),
  };

  public data: F['data'];
  public config: F['config'];
  public events: F['events'];
  public factories: F['factories'];
  public views: F['views'];
  public models: F['models'];
  public collections: F['collections'];
  public dataManagers: F['dataManagers'];
  public features: F['features'];
  public translations: F['translations'];
  private parentFeature: F['parentFeature'] | null = null;

  constructor(settings?: Partial<F>) {
    this.uuid = uuid4();
    this.config = {
      ...this.defaultConfig,
    };
    this.events = {};
    this.collections = {};
    this.factories = {};
    this.views = {};
    this.models = {};
    this.dataManagers = {};
    this.features = {};
    this.translations = {};
    this.data = {
      ...this.defaultData,
    };

    if (settings) {
      this.setInitialDataPartly(settings);
    }
  }

  get defaultData(): Partial<F['data']> {
    return {};
  }

  get defaultConfig(): Partial<F['config']> {
    return {};
  }

  setParentFeature(feature: F['parentFeature']) {
    this.parentFeature = feature;
  }

  getParentFeature(): F['parentFeature'] | never {
    if (this.hasParentFeature()) {
      return this.parentFeature as F['parentFeature'];
    }
  }

  hasParentFeature(): boolean {
    return this.parentFeature instanceof Feature;
  }

  public setInitialData(data: Omit<F, 'parentFeature'>): boolean {
    return this.setInitialDataPartly(data);
  }

  public setInitialDataPartly(
    data: Partial<Omit<F, 'parentFeature'>>,
  ): boolean {
    if (this.isInitialized()) return false;

    if (data.config) {
      this.config = data.config;
    }
    if (data.collections) {
      this.collections = data.collections;
    }
    if (data.dataManagers) {
      this.dataManagers = data.dataManagers;
    }
    if (data.events) {
      this.events = data.events;
    }
    if (data.factories) {
      this.factories = data.factories;
    }
    if (data.features) {
      this.features = data.features;
    }
    if (data.models) {
      this.models = data.models;
    }
    if (data.translations) {
      this.translations = data.translations;
    }
    if (data.views) {
      this.views = data.views;
    }
    if (data.data) {
      this.data = data.data;
    }

    return true;
  }

  public setApp(app: A): boolean {
    if (!appData.has(this.uuid)) {
      appData.set(this.uuid, app);
      return true;
    }

    return false;
  }

  public getApp(): A {
    if (appData.has(this.uuid)) {
      return appData.get(this.uuid) as A;
    }

    throw Error('App is not defined');
  }

  public hasApp(): boolean {
    return appData.has(this.uuid);
  }

  public init(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const promises: unknown[] = [];
      if (this.features) {
        Object.keys(this.features!).forEach((key) => {
          if (this.features && (this.features[key] as IFeature<any, any>)) {
            const feature = this.features[key];
            feature.setParentFeature(this);
            promises.push(feature.init());
          }
        });
      }
      Promise.all(promises).then(() => {
        this.initTranslations();
        this.initFeature()
          .then((result) => {
            this.setInitialized(result);
            this.baseEvents.initialized.fire(result);
            this.getApp().baseEvents.onFeatureInitialized.fire(this);
            this.getApp().info(
              `Feature '${this.name}' successfully initialized`,
            );
            return resolve(result);
          })
          .catch((e) => {
            this.baseEvents.onError.fire(false);
            this.getApp().err(
              `Failed to initialize the feature '${this.name}' (${e})`,
            );
            return reject(e);
          });
      });
    });
  }

  private initTranslations(): void {
    const setAppToTranslations = (
      translations: Record<string, Translations<unknown>>,
    ) => {
      Object.keys(translations).forEach((translationKey) => {
        const translation = translations[translationKey];
        if (translation instanceof Translations) {
          translation.setApp(this.getApp());
        } else if (
          typeof translation === 'object' &&
          Object.keys(translation).length > 0
        ) {
          setAppToTranslations(translation);
        }
      });
    };

    if (this.translations) {
      setAppToTranslations(this.translations!);
    }
  }

  abstract initFeature(): Promise<boolean>;

  cfg(): F['config'] {
    return this.config;
  }

  updateConfig(newConfig: Partial<F['config']>): void {
    this.config = {
      ...this.config,
      ...newConfig,
    };
    this.baseEvents.onUpdate.fire(this);
    if (this.hasApp()) {
      this.getApp().baseEvents.onFeatureUpdated.fire(this);
    }
  }

  updateData(data: Partial<F['data']>): void {
    this.data = {
      ...this.data,
      ...data,
    };
    this.baseEvents.onDataUpdate.fire(this);
  }

  isInitialized(): boolean {
    return privateData.get(this.uuid)?.initialized || false;
  }

  setInitialized(initialized: boolean): void {
    privateData.set(this.uuid, {
      initialized,
    });
  }

  update() {
    this.baseEvents.onUpdate.fire(this);
  }
}
