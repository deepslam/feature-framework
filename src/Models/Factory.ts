import Model from './Model';
import Feature from './Feature';
import { IFactory, IFeature, IModel } from '../Interfaces';

export default class Factory {
  public static createFeature<
    T extends IFeature<P>,
    P extends Pick<T, 'getConfig'>
  >(Class: T, params: P): new (options: P) => T {
    return new Class(params);
  }
}
