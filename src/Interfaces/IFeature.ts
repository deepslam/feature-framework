import { Slice } from '@reduxjs/toolkit';
import { IEvent } from './IEvent';
import { IModel } from './IModel';
import { FeatureConfigType } from '../Types';

export interface IFeature<C = Record<string, FeatureConfigType>> {
  // new (config: C): IFeature;

  init(): Promise<boolean>;
  isInitialized(): boolean;
  setInitialized(val: boolean): void;

  getConfig(): C;
  getBaseEvents(): Record<string, IEvent<unknown>>;
  getEvents(): Record<string, IEvent<unknown>>;
  getModels(): Record<string, IModel>;
  getSubFeatures(): Record<string, IFeature>;
  getSlices(): Record<string, Slice>;

  initFeature(): Promise<boolean>;

  extendConfig(config: Partial<C>): void;

  hasSlice(): boolean;
}
