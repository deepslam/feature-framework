import { Feature, Model } from '../Models';

export interface IFactory {
  create<T extends Feature<Pick<T, 'getConfig'>> | Model>(
    type: T,
  ): new (...args: unknown[]) => T;
  clone<T extends Feature<Pick<T, 'getConfig'>> | Model>(
    type: T,
    instance: new (...args: unknown[]) => T,
  ): new (...args: unknown[]) => T;
}
