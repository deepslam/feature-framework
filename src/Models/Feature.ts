/* eslint-disable indent */
import { v4 as uuid4 } from 'uuid';
import {
  FeatureErrorEvent,
  FeatureInitializedEvent,
  FeatureUpdatedEvent,
} from '../Events/Features';
import { IApp, IFeature } from '../Interfaces';
import { FeatureCommonType, FeatureStandardEventsType } from '../Types';

type AbstractFeaturePrivateDataType = {
  initialized: boolean;
};

const privateData = new Map<string, Partial<AbstractFeaturePrivateDataType>>();
const appData = new Map<string, IApp>();

export default abstract class Feature<
  F extends FeatureCommonType,
  A extends IApp
> implements IFeature<F, A> {
  public abstract name: string;
  public readonly uuid: string;
  public readonly baseEvents: FeatureStandardEventsType<F['config']> = {
    initialized: new FeatureInitializedEvent(),
    onError: new FeatureErrorEvent(),
    onUpdate: new FeatureUpdatedEvent(),
  };

  public config: F['config'];
  public events: F['events'];
  public factories: F['factories'];
  public views: F['views'];
  public models: F['models'];
  public collections: F['collections'];
  public dataManagers: F['dataManagers'];
  public features: F['features'];
  public translations: F['translations'];

  constructor(settings?: F) {
    this.uuid = uuid4();
    this.config = {};
    this.events = {};
    this.collections = {};
    this.factories = {};
    this.views = {};
    this.models = {};
    this.dataManagers = {};
    this.features = {};
    this.translations = {};

    if (settings) {
      this.setData(settings);
    }
  }

  public setData(data: F): boolean {
    return this.setPartialData(data);
  }

  public setPartialData(data: Partial<F>): boolean {
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
            promises.push(feature.init());
          }
        });
      }
      Promise.all(promises).then(() => {
        this.initFeature()
          .then((result) => {
            this.setInitialized(result);
            this.baseEvents.initialized.fire(result);
            this.getApp().baseEvents.onFeatureInitialized.fire(this);
            this.getApp().info(
              `Feature '${this.name}' successfully initialized`,
            );
            resolve(result);
          })
          .catch((e) => {
            this.baseEvents.onError.fire(false);
            this.getApp().err(
              `Failed to initialize the feature '${this.name}' (${e})`,
            );
            reject(e);
          });
      });
    });
  }

  abstract initFeature(): Promise<boolean>;

  cfg(): F['config'] {
    return this.config;
  }

  extendConfig(newConfig: Partial<F['config']>): void {
    this.config = {
      ...this.config,
      ...newConfig,
    };
    this.baseEvents.onUpdate.fire(this.config);
    this.getApp().baseEvents.onFeatureUpdated.fire(this);
  }

  isInitialized(): boolean {
    return privateData.get(this.uuid)?.initialized || false;
  }

  setInitialized(initialized: boolean): void {
    privateData.set(this.uuid, {
      initialized,
    });
  }
}
