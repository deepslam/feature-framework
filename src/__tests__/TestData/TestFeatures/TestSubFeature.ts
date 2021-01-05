import Feature from '../../../Models/Feature';
import TestApplication from '../Application/TestApplication';
import { TestTranslations } from '../TestTranslations/TestTranslations';
import TestFeature from './TestFeature';

type TestSubFeatureConfig = {
  enabled: boolean;
};

type TestSubFeatureType = {
  parentFeature: TestFeature;
  config: TestSubFeatureConfig;
  translations: {
    testTranslations: TestTranslations;
  };
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
