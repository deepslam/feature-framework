import { Reducer, Store } from '@reduxjs/toolkit';
import AbstractFeature from './Models/AbstractFeature';
import IFeature from './Interfaces/IFeature';

export type FeatureInstance = IFeature & InstanceType<typeof AbstractFeature>;
export type Config =
  | number
  | string
  | boolean
  | unknown[]
  | { [key: string]: Config };

export type AppFeatures = Record<string, FeatureInstance>;
export type AppReducers = Record<string, Reducer>;

export type AppInitParams<F = AppFeatures, R = AppReducers, C = Config> = {
  features: F;
  config: R;
  reducers: C;
};
