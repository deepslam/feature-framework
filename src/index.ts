import { createApp } from './Application/Application';
import AbstractFeature from './Models/Feature';
import AbstractModel from './Models/Model';

import IApp from './Interfaces/IApp';
import IFeature from './Interfaces/IFeature';

export type Interfaces = {
  IApp: IApp;
  IFeature: IFeature;
};
export * from './Types';

export { createApp, AbstractFeature, AbstractModel };
