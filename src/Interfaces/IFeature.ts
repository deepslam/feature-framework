import { Slice } from '@reduxjs/toolkit';
import { IEvent } from './IEvent';
import { IView } from './IView';
import { IModel } from './IModel';
import { ConfigType, TranslationType } from '../Types';

export interface IFeature<C = Record<string, ConfigType>> {
  baseEvents: Record<string, IEvent<unknown>>;
  events: Record<string, IEvent<unknown>>;
  features: Record<string, IFeature>;
  slices: Record<string, Slice>;
  translations: TranslationType;
  view: IView<unknown, unknown> | null;

  init(): Promise<boolean>;
  isInitialized(): boolean;
  setInitialized(val: boolean): void;

  getConfig(): C;
  getModels(): Record<string, IModel>;

  initFeature(): Promise<boolean>;

  extendConfig(config: Partial<C>): void;

  hasSlice(): boolean;
}
