/* eslint-disable indent */
import { v4 as uuid4 } from 'uuid';
import {
  FeatureInitializedEvent,
  FeatureErrorEvent,
  FeatureUpdatedEvent,
} from '../Events/Features';
import { IFeature, IApp } from '../Interfaces';
import {
  AppFeaturesType,
  ConfigType,
  FeatureStandardEventsType,
} from '../Types';

type AbstractFeaturePrivateDataType = {
  initialized: boolean;
};

const privateData = new Map<string, Partial<AbstractFeaturePrivateDataType>>();
const appData = new Map<string, IApp>();

export default abstract class Feature<
  C extends Record<string, ConfigType>,
  A extends IApp,
  F extends AppFeaturesType
> implements IFeature<C, A> {
  public abstract name: string;
  public readonly uuid: string;
  public readonly baseEvents: FeatureStandardEventsType<C> = {
    initialized: new FeatureInitializedEvent(),
    onError: new FeatureErrorEvent(),
    onUpdate: new FeatureUpdatedEvent(),
  };

  constructor(public config: C, public readonly features: F) {
    this.uuid = uuid4();
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
        Object.keys(this.features).forEach((key) => {
          if (this.features && this.features[key]) {
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

  cfg(): C {
    return this.config;
  }

  extendConfig(newConfig: Partial<C>): void {
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
