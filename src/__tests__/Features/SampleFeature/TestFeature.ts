import Feature from '../../../Models/Feature';
import { IEvent } from '../../../Interfaces';
import TestFeatureLoadedEvent from '../Events/TestFeatureLoadedEvent';
import TestSubFeature from './TestSubFeature';

type TestFeatureConfig = {
  name: string;
  id: number;
};

type TestFeatureEvents = {
  loaded: IEvent<boolean>;
};

export default class TestFeature extends Feature<TestFeatureConfig> {
  components() {
    return {};
  }

  getConfig(): TestFeatureConfig {
    return {
      name: 'test',
      id: 2,
    };
  }

  getSubFeatures() {
    return {
      SubFeature: new TestSubFeature({ enabled: false }),
    };
  }

  initFeature() {
    return new Promise((resolve) => resolve(true)) as Promise<boolean>;
  }

  getModels() {
    return {};
  }

  getSlices() {
    return {};
  }

  getFeatureEvents() {
    return {
      loaded: new TestFeatureLoadedEvent(),
    };
  }
}
