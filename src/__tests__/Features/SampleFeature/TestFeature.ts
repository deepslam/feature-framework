import Feature from '../../../Models/Feature';
import { IEvent } from '../../../Interfaces';

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
    return {};
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

  getEvents() {
    return {};
  }
}
