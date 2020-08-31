import Feature from '../../../Models/Feature';

type TestSubFeatureConfig = {
  enabled: boolean;
};

type TestSubFeatureEvents = {};

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

  getFeatureEvents(): TestSubFeatureEvents {
    return {};
  }
}
