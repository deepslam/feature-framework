import { Slice } from '@reduxjs/toolkit';
import { IEvent, IFeature } from '../Interfaces';
import { ConfigType, TranslationType } from '../Types';

export interface IApp<C = Record<string, ConfigType>> {
  baseEvents: Record<string, IEvent<unknown>>;
  events: Record<string, IEvent<unknown>>;
  features: Record<string, IFeature>;
  slices: Record<string, Slice>;
  translations: TranslationType;

  getConfig(): C;
}
