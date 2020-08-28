import { createApp } from './Application/Application';
import AbstractFeature from './Models/AbstractFeature';
import AbstractModel from './Models/AbstractModel';

import IApp from './Interfaces/IApp';
import IFeature from './Interfaces/IFeature';

export type Interfaces = {
  IApp: IApp;
  IFeature: IFeature;
};
export * from './Types';

export { createApp, AbstractFeature, AbstractModel };
