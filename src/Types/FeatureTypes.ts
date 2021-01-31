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
  parentFeature?: IFeature<any, any>;
  config?: Record<string, ConfigType>;
  data?: Record<string, any>;
  events?: Record<string, IEvent<unknown>>;
  factories?: Record<string, Factory<any>>;
  views?: Record<string, IView<unknown>>;
  models?: Record<string, IModel<unknown>>;
  collections?: Record<string, IDataCollection<unknown>>;
  dataManagers?: Record<string, IDataManager<unknown>>;
  features?: Record<string, IFeature<Record<string, any>, IApp<any>>>;
  translations?: Record<string, Translations<unknown>>;
};
