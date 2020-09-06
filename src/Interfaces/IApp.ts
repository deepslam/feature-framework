import { Reducer } from '@reduxjs/toolkit';
import {
  IEvent,
  IFeature,
  IView,
  IDataCollection,
  IModel,
  IDataManager,
  IDataProvider,
} from '../Interfaces';
import { ConfigType, TranslationType } from '../Types';

export interface IApp<C = Record<string, ConfigType>> {
  baseEvents: Record<string, IEvent<unknown>>;
  events?: Record<string, IEvent<unknown>>;
  features?: Record<string, IFeature>;
  reducers: Record<string, Reducer>;
  translations?: TranslationType;
  view?: IView<unknown, unknown> | null;
  models?: Record<string, IModel<unknown>>;
  collections?: Record<string, IDataCollection<unknown, unknown>>;
  dataManagers?: Record<string, IDataManager<unknown>>;
  dataProviders?: Record<string, IDataProvider>;

  cfg(): C;
  extendConfig(config: Partial<C>): void;
  init(): Promise<boolean>;
}
