import Feature from '../../../Models/Feature';
import TestApplication from '../Application/TestApplication';
import { AppFeaturesType } from '../../../Types';

type TestSubFeatureConfig = {
  enabled: boolean;
};

export default class TestSubFeature extends Feature<
  TestSubFeatureConfig,
  TestApplication,
  AppFeaturesType
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
