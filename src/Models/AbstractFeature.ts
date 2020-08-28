import { resolveConfig } from 'prettier';
import IAbstractFeature from '../Interfaces/IAbstractFeature';
import IFeature from '../Interfaces/IFeature';

export type AbstractFeaturePrivateDataType = {
  initialized: boolean;
};

const privateData = new WeakMap<
  AbstractFeature,
  Partial<AbstractFeaturePrivateDataType>
>();

export default class AbstractFeature implements IAbstractFeature {
  init(this: IFeature & IAbstractFeature): Promise<boolean> {
    return new Promise((resolve) => {
      this.initFeature().then((result) => {
        this.setInitialized(true);
        resolve(result);
      });
    });
  }

  isInitialized() {
    return privateData.get(this)?.initialized || false;
  }

  setInitialized(initialized: boolean) {
    privateData.set(this, {
      initialized,
    });
  }

  hasSlice(this: IFeature & IAbstractFeature): boolean {
    return Object.keys(this.getSlice()).length > 0 && this.isInitialized();
  }
}
