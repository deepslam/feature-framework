import { Slice } from '@reduxjs/toolkit';
import { ElementType } from 'react';
import AbstractModel from '../Models/AbstractModel';

type ComponentType =
  | React.ElementType
  | ComponentType[]
  | { [name: string]: ComponentType };
type ConfigType =
  | boolean
  | string
  | number
  | ConfigType[]
  | { [name: string]: ConfigType };

export default interface IFeature {
  initFeature(): Promise<boolean>;

  models(): Record<string, typeof AbstractModel>;
  components(): Record<string, ComponentType>;

  getConfig(): Record<string, ConfigType>;
  getSlice(): Record<string, Slice>;
}
