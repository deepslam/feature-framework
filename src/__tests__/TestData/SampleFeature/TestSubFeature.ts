import Feature from '../../../Models/Feature';

type TestSubFeatureConfig = {
  enabled: boolean;
};

export default class TestSubFeature extends Feature<TestSubFeatureConfig> {
  public readonly features = {};
  public readonly events = {};
  public readonly slices = {};
  public readonly translations = {};
  public readonly view = null;

  components() {
    return {};
  }

  getConfig(): TestSubFeatureConfig {
    return {
      enabled: false,
    };
  }

  initFeature() {
    return new Promise((resolve) => resolve(true)) as Promise<boolean>;
  }

  getModels() {
    return {};
  }
}
