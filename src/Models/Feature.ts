import { Slice } from '@reduxjs/toolkit';
import { IFeature, IEvent, IModel } from '../Interfaces';
import { FeatureOptions, FeatureConfigType } from '../Types';

type AbstractFeaturePrivateDataType = {
  initialized: boolean;
};

const privateData = new WeakMap<
  IFeature,
  Partial<AbstractFeaturePrivateDataType>
>();

export default abstract class Feature<
  C = Record<string, FeatureConfigType>,
  E = Record<string, IEvent<unknown>>,
  R = Record<string, Slice>
> implements IFeature<C, E, R> {
  protected config: C;
  constructor(protected extendedConfig: Partial<C>) {
    this.config = {
      ...this.config,
      ...extendedConfig,
    };
  }

  init(this: IFeature): Promise<boolean> {
    return new Promise((resolve) => {
      this.initFeature().then((result) => {
        this.setInitialized(true);
        resolve(result);
      });
    });
  }

  abstract initFeature(): Promise<boolean>;
  abstract getSubFeatures(): Record<string, IFeature>;
  abstract getModels(): Record<string, IModel>;

  abstract getEvents(): E;

  abstract getSlices(): R;

  getConfig(): C {
    return this.config;
  }

  extendConfig(newConfig: Partial<C>) {
    this.config = {
      ...this.config,
      ...newConfig,
    };
  }

  isInitialized(this: IFeature) {
    return privateData.get(this)?.initialized || false;
  }

  setInitialized(this: IFeature, initialized: boolean) {
    privateData.set(this, {
      initialized,
    });
  }

  hasSlice(this: IFeature): boolean {
    return Object.keys(this.slices).length > 0 && this.isInitialized();
  }
}
