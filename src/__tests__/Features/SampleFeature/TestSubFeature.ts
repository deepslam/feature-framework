import Feature from '../../../Models/Feature';
import { IEvent, IFeature } from '../../../Interfaces';
import TestFeatureLoadedEvent from '../Events/TestFeatureLoadedEvent';

type TestSubFeatureConfig = {
  enabled: boolean;
};

type TestSubFeatureEvents = {
  loaded: IEvent<boolean>;
  created: IEvent<{ instance: IFeature; created: boolean }>;
};

export default class TestSubFeature extends Feature<TestSubFeatureConfig> {
  components() {
    return {};
  }

  getConfig(): TestSubFeatureConfig {
    return {
      enabled: false,
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

  getEvents(): TestSubFeatureEvents {
    return {
      loaded: new TestFeatureLoadedEvent(),
    };
  }
}
