import { Slice } from '@reduxjs/toolkit';
import IFeature from '../Interfaces/IFeature';

export type FeatureComponentType =
  | React.ElementType
  | FeatureComponentType[]
  | { [name: string]: FeatureComponentType };

export type FeatureConfigType =
  | boolean
  | string
  | number
  | FeatureConfigType[]
  | { [name: string]: FeatureConfigType };

export type FeatureOptions<
  C = Record<string, FeatureConfigType>,
  E = Record<string, FeatureEvent<() => void>>,
  S = Record<string, Slice>
> = {
  config: C;
  events: E;
  slices: S;
};

export type FeatureInstance = IFeature;

export type AppFeatures = Record<string, FeatureInstance>;

export type FeatureEvent<C> = C;
