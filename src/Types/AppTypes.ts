import { Reducer } from '@reduxjs/toolkit';
import { IFeature } from '../Interfaces';

export type AppConfig =
  | number
  | string
  | boolean
  | unknown[]
  | { [key: string]: AppConfig };

export type AppReducers = Record<string, Reducer>;

export type AppInitParams<F = AppFeatures, R = AppReducers, C = AppConfig> = {
  features: F;
  config: R;
  reducers: C;
};

export type AppFeatures = Record<string, IFeature>;
