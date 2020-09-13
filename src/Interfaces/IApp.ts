import { Reducer } from '@reduxjs/toolkit';
import {
  IEvent,
  IFeature,
  IView,
  IDataCollection,
  IModel,
  IDataManager,
  IDataProvider,
  ILogger,
} from '../Interfaces';
import { ConfigType, TranslationType } from '../Types';
import Factory from '../Models/Factory';
import { IErrorHandler } from './IErrorHandler';
import { ErrorTypeEnum } from 'Types/ErrorTypes';
import { ErrorHandler } from 'Models';

export interface IApp<C = Record<string, ConfigType>> {
  debug: boolean;
  baseEvents: Record<string, IEvent<unknown>>;
  events?: Record<string, IEvent<unknown>>;
  factories?: Record<string, Factory<any>>;
  features?: Record<string, IFeature>;
  reducers: Record<string, Reducer>;
  translations?: TranslationType;
  view?: IView<unknown> | null;
  models?: Record<string, IModel<unknown>>;
  collections?: Record<string, IDataCollection<unknown, unknown>>;
  dataManagers?: Record<string, IDataManager<unknown>>;
  dataProviders?: Record<string, IDataProvider>;
  logger: ILogger;
  errorHandler: IErrorHandler;

  additionalLoggers: ILogger[];
  additionalErrorHandlers: ErrorHandler[];

  cfg(): C;
  extendConfig(config: Partial<C>): void;
  init(): Promise<boolean>;

  err(error: string): void;
  throwErr(error: string): void;
  warning(error: string): void;

  log(message: string, type: ErrorTypeEnum): void;
  info(message: string): void;
}
