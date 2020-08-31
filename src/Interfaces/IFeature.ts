import { Slice } from '@reduxjs/toolkit';
import { IEvent } from './IEvent';
import { IModel } from './IModel';
import { FeatureConfigType } from '../Types';

export interface IFeature<C = Record<string, FeatureConfigType>> {
  baseEvents: Record<string, IEvent<unknown>>;
  events: Record<string, IEvent<unknown>>;
  features: Record<string, IFeature>;
  slices: Record<string, Slice>;

  init(): Promise<boolean>;
  isInitialized(): boolean;
  setInitialized(val: boolean): void;

  getConfig(): C;

  getEvents(): Record<string, IEvent<unknown>>;
  getModels(): Record<string, IModel>;

  initFeature(): Promise<boolean>;

  extendConfig(config: Partial<C>): void;

  hasSlice(): boolean;
}
