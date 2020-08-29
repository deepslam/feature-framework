import IFeature from '../Interfaces/IFeature';

export type FeatureConfigType =
  | boolean
  | string
  | number
  | FeatureConfigType[]
  | { [name: string]: FeatureConfigType };

export type FeatureOptions<C> = {
  config: C;
};
