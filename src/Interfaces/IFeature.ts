import { IDataCollection } from './IDataCollection';
import { IApp } from './IApp';
import { IEvent } from './IEvent';
import { IView } from './IView';
import { IModel } from './IModel';
import { IDataManager } from './IDataManager';
import { AppFeaturesType, ConfigType } from '../Types';
import { Translations, Factory } from '../Models';

export interface IFeature<
  C extends Record<string, ConfigType>,
  A extends IApp
> {
  name: string;

  baseEvents: Record<string, IEvent<unknown>>;
  events?: Record<string, IEvent<unknown>>;
  factories?: Record<string, Factory<any>>;
  translations?: Record<string, Translations<unknown>>;
  views?: Record<string, IView<unknown>>;
  models?: Record<string, IModel<unknown>>;
  collections?: Record<string, IDataCollection<unknown>>;
  dataManagers?: Record<string, IDataManager<unknown>>;

  features: AppFeaturesType;

  init(): Promise<boolean>;
  initFeature(): Promise<boolean>;

  setApp(app: A): boolean;
  getApp(): A;
  hasApp(): boolean;

  isInitialized(): boolean;
  setInitialized(val: boolean): void;

  cfg(): C;
  extendConfig(config: Partial<C>): void;
}
