import Feature from '../../../Models/Feature';
import TestApplication from '../Application/TestApplication';

type TestSubFeatureConfig = {
  enabled: boolean;
};

type TestSubFeatureType = {
  config: TestSubFeatureConfig;
};

export default class TestSubFeature extends Feature<
  TestSubFeatureType,
  TestApplication
> {
  name = 'TestSubFeature';

  getConfig(): TestSubFeatureConfig {
    return {
      enabled: false,
    };
  }

  initFeature() {
    return new Promise((resolve) => resolve(true)) as Promise<boolean>;
  }
}
