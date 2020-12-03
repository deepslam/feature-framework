import { ConfigType } from './index';
import {
  IApp,
  IDataCollection,
  IDataManager,
  IEvent,
  IFeature,
  IModel,
  IView,
} from '../Interfaces';
import { Factory, Translations } from '../Models';

export type FeatureCommonType = {
  config?: Record<string, ConfigType>;
  events?: Record<string, IEvent<unknown>>;
  factories?: Record<string, Factory<any>>;
  views?: Record<string, IView<unknown>>;
  models?: Record<string, IModel<unknown>>;
  collections?: Record<string, IDataCollection<unknown>>;
  dataManagers?: Record<string, IDataManager<unknown>>;
  features?: Record<
    string,
    IFeature<Record<string, any>, IApp<Record<string, any>>>
  >;
  translations?: Record<string, Translations<unknown>>;
};
