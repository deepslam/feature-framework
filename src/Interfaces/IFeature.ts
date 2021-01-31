import { IApp } from './IApp';
import { FeatureCommonType, FeatureStandardEventsType } from '../Types';

export interface IFeature<F extends FeatureCommonType, A extends IApp<any>> {
  name: string;

  config: F['config'];
  data: F['data'];
  baseEvents: FeatureStandardEventsType<IFeature<F, A>>;
  events: F['events'];
  factories: F['factories'];
  translations: F['translations'];
  views: F['views'];
  models: F['models'];
  collections: F['collections'];
  dataManagers: F['dataManagers'];
  features: F['features'];

  init(): Promise<boolean>;
  initFeature(): Promise<boolean>;

  setInitialData(data: F): boolean;
  setInitialDataPartly(data: Partial<F>): boolean;

  setApp(app: A): boolean;
  getApp(): A;
  hasApp(): boolean;

  isInitialized(): boolean;
  setInitialized(val: boolean): void;

  cfg(): F['config'];
  updateConfig(config: Partial<F['config']>): void;

  updateData(data: Partial<F['data']>): void;

  update(): void;

  setParentFeature(feature: F['parentFeature']): void;
  getParentFeature(): F['parentFeature'] | never;
  hasParentFeature(): boolean;
}
