import { Slice } from '@reduxjs/toolkit';
import IEvent from './IEvent';
import IModel from './IModel';
import { FeatureConfigType, FeatureOptions } from '../Types';

export default interface IFeature<
  C = Record<string, FeatureConfigType>,
  E = Record<string, IEvent<unknown>>,
  S = Record<string, Slice>
> {
  config: C;

  constructor(config: Partial<C>): IFeature<C, E, S>;

  init(): Promise<boolean>;
  isInitialized(): boolean;
  setInitialized(val: boolean): void;

  getConfig(): C;
  getEvents(): E;
  getModels(): Record<string, IModel>;
  getSubFeatures(): Record<string, IFeature>;
  getSlices(): S;

  initFeature(): Promise<boolean>;

  extendConfig(config: Partial<C>): void;

  hasSlice(): boolean;
}
