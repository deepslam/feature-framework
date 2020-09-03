import Feature from '../../../Models/Feature';

type TestSubFeatureConfig = {
  enabled: boolean;
};

export default class TestSubFeature extends Feature<TestSubFeatureConfig> {
  getConfig(): TestSubFeatureConfig {
    return {
      enabled: false,
    };
  }

  initFeature() {
    return new Promise((resolve) => resolve(true)) as Promise<boolean>;
  }
}
