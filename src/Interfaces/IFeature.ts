import { Slice } from '@reduxjs/toolkit';
import IEvent from './IEvent';
import {
  FeatureConfigType,
  FeatureOptions,
  FeatureComponentType,
} from '../Types';

export default interface IFeature<
  C = Record<string, FeatureConfigType>,
  E = Record<string, IEvent<unknown>>,
  S = Record<string, Slice>
> {
  slices: S;
  events: E;
  config: C;

  constructor(options: FeatureOptions<C, E, S>): IFeature<C, E, S>;

  init(): Promise<boolean>;
  isInitialized(): boolean;
  setInitialized(val: boolean): void;

  getEvents(): E;

  initFeature(): Promise<boolean>;

  extendConfig<K = Extract<C, keyof C>>(key: K, value: C[K]): void;
  getConfig<K = Extract<C, keyof C>>(key: K): any;

  on<K extends keyof E>(event: K, callback: (item: E[K]) => void): void;
  fireEvent<K extends keyof E>(event: K): void;

  // models(): Record<string, typeof AbstractModel>;
  components(): Record<string, FeatureComponentType>;

  hasSlice(): boolean;
  getSlices(): Record<string, Slice>;
}
