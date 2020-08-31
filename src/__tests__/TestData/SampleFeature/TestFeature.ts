import Feature from '../../../Models/Feature';
import { IEvent } from '../../../Interfaces';
import TestFeatureLoadedEvent from '../Events/TestFeatureLoadedEvent';
import TestSubFeature from './TestSubFeature';

type TestFeatureConfig = {
  name: string;
  id: number;
};

export default class TestFeature extends Feature<TestFeatureConfig> {
  public readonly features = {
    SubFeature: new TestSubFeature({ enabled: false }),
  };
  public readonly slices = {};
  public readonly events = {
    loaded: new TestFeatureLoadedEvent(),
  };

  components() {
    return {};
  }

  initFeature() {
    return new Promise((resolve) => resolve(true)) as Promise<boolean>;
  }

  getModels() {
    return {};
  }
}
