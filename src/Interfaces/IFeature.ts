import { Slice } from '@reduxjs/toolkit';

import {
  FeatureConfigType,
  FeatureEvent,
  FeatureOptions,
  FeatureComponentType,
} from '../Types';

export default interface IFeature<
  C = FeatureConfigType,
  E = Record<string, FeatureEvent<() => void>>,
  S = Record<string, Slice>
> {
  constructor(options: FeatureOptions<C, E, S>): IFeature<C, E, S>;

  init(): Promise<boolean>;
  isInitialized(): boolean;
  setInitialized(val: boolean): void;
  hasSlice(): boolean;

  initFeature(): Promise<boolean>;
  extendConfig<K extends keyof C>(key: K, value: C[K]): void;

  on(event: keyof E, callback: () => void): void;
  fireEvent(event: keyof E): void;

  // models(): Record<string, typeof AbstractModel>;
  components(): Record<string, FeatureComponentType>;

  getConfig(): Record<string, FeatureConfigType>;
  // getSlice(): Record<string, Slice>;
}
