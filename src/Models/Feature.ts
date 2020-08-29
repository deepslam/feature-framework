import { Slice } from '@reduxjs/toolkit';
import { IFeature, IEvent } from '../Interfaces';
import {
  FeatureOptions,
  FeatureComponentType,
  FeatureConfigType,
} from '../Types';

type AbstractFeaturePrivateDataType = {
  initialized: boolean;
};

const privateData = new WeakMap<
  IFeature,
  Partial<AbstractFeaturePrivateDataType>
>();

export default abstract class Feature<
  C = Record<string, FeatureConfigType>,
  E = Record<string, IEvent<() => void>>,
  R = Record<string, Slice>
> implements IFeature<C, E, R> {
  protected slices: R;
  protected config: C;
  protected events: E;

  constructor(options: FeatureOptions<C, E, R>) {
    this.slices = options.slices as R;
    this.events = { ...options.events } as E;
    this.config = options.config as C;
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
  abstract components(): Record<string, FeatureComponentType>;

  getEvents(): E {
    return this.events;
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

  getConfig<K = Extract<C, keyof C>>(key: K): any {}

  on(event, callback) {}
  fireEvent(event) {}
}
