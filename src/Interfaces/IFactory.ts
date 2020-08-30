import { IFeature } from './IFeature';

export interface IFactory {
  create<T extends IFeature<P>, P extends Pick<T, 'getConfig'>>(
    type: T,
    params: P,
  ): new (args: P) => T;
}
