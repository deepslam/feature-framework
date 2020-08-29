export type FeatureConfigType =
  | boolean
  | string
  | number
  | FeatureConfigType[]
  | { [name: string]: FeatureConfigType };
