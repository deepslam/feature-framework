import Model from './Model';
import Feature from './Feature';
import { IFactory, IFeature, IModel } from '../Interfaces';

export default class Factory implements IFactory {
  create<T extends IFeature | IModel>(Class: T): new (...args: unknown[]) => T {
    return new Class() as new (...args: unknown[]) => T;
  }

  clone<T extends Feature<Pick<T, 'getConfig'>> | Model>(
    type: T,
    instance: new (...args: unknown[]) => T,
  ): new (...args: unknown[]) => T {
    return new type() as new (...args: unknown[]) => T;
  }
}
