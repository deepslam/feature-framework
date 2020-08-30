import { Slice } from '@reduxjs/toolkit';
import SuccessFullyInitializedEvent from 'Events/SuccessfullyInitializedEvent';
import { IFeature, IEvent, IModel } from '../Interfaces';
import { FeatureConfigType } from '../Types';

type AbstractFeaturePrivateDataType = {
  initialized: boolean;
};

const privateData = new WeakMap<
  IFeature,
  Partial<AbstractFeaturePrivateDataType>
>();

export default abstract class Feature<C = Record<string, FeatureConfigType>>
  implements IFeature<C> {
  constructor(protected config: C) {}

  init(this: IFeature): Promise<boolean> {
    return new Promise((resolve) => {
      this.initFeature().then((result) => {
        this.setInitialized(true);
        this.getBaseEvents().initialized.fire(true);
        resolve(result);
      });
    });
  }

  getBaseEvents(): { initialized: IEvent<boolean> } {
    return {
      initialized: new SuccessFullyInitializedEvent(),
    };
  }

  getEvents(): Record<string, IEvent<unknown>> {
    return {
      ...this.getBaseEvents(),
      ...this.getFeatureEvents(),
    };
  }

  abstract initFeature(): Promise<boolean>;
  abstract getSubFeatures(): Record<string, IFeature>;
  abstract getModels(): Record<string, IModel>;
  abstract getFeatureEvents(): Record<string, IEvent<unknown>>;
  abstract getSlices(): Record<string, Slice>;

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
    return Object.keys(this.getSlices()).length > 0 && this.isInitialized();
  }
}
