/* eslint-disable indent */
import { Slice } from '@reduxjs/toolkit';
import { v4 as uuid4 } from 'uuid';
import SuccessFullyInitializedEvent from '../Events/SuccessfullyInitializedEvent';
import { IFeature, IEvent, IModel, IView } from '../Interfaces';
import { ConfigType, TranslationType } from '../Types';

type AbstractFeaturePrivateDataType = {
  initialized: boolean;
};

const privateData = new Map<string, Partial<AbstractFeaturePrivateDataType>>();

export default abstract class Feature<C = Record<string, ConfigType>>
  implements IFeature<C> {
  public readonly uuid: string;
  public readonly baseEvents: { initialized: IEvent<boolean> } = {
    initialized: new SuccessFullyInitializedEvent(),
  };
  abstract events: Record<string, IEvent<unknown>>;
  abstract features: Record<string, IFeature>;
  abstract slices: Record<string, Slice>;
  abstract translations: TranslationType;
  abstract view: IView<unknown, unknown> | null;

  constructor(protected config: C) {
    this.uuid = uuid4();
  }

  init(this: IFeature): Promise<boolean> {
    return new Promise((resolve) => {
      const promises: unknown[] = [];
      Object.keys(this.features).forEach((key) => {
        const feature = this.features[key];
        promises.push(feature.init());
      });
      Promise.all(promises).then(() => {
        this.initFeature().then((result) => {
          this.setInitialized(result);
          this.baseEvents.initialized.fire(result);
          resolve(result);
        });
      });
    });
  }

  abstract initFeature(): Promise<boolean>;
  abstract getModels(): Record<string, IModel>;

  getConfig(): C {
    return this.config;
  }

  extendConfig(newConfig: Partial<C>): void {
    this.config = {
      ...this.config,
      ...newConfig,
    };
  }

  isInitialized(): boolean {
    return privateData.get(this.uuid)?.initialized || false;
  }

  setInitialized(initialized: boolean): void {
    privateData.set(this.uuid, {
      initialized,
    });
  }

  hasSlice(this: IFeature): boolean {
    return Object.keys(this.slices).length > 0 && this.isInitialized();
  }
}
