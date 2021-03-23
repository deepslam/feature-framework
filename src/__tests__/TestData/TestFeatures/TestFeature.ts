import Feature from '../../../Models/Feature';
import TestFeatureLoadedEvent from '../Events/TestFeatureLoadedEvent';
import TestSubFeature from './TestSubFeature';
import TestModel from '../TestModels/TestModel';
import TestCollection from '../DataCollection/TestDataCollection';
import { IFeature } from '../../../Interfaces/IFeature';
import TestFactory from '../TestFactories/TestFactory';
import TestApplication from '../Application/TestApplication';
import { TestTranslations } from '../TestTranslations/TestTranslations';

type TestFeatureConfig = {
  name: string;
  id: number;
};

type TestFeatureData = {
  name: string;
  phone: string;
};

type TestFeatureType = {
  config: TestFeatureConfig;
  data: TestFeatureData;
  features: {
    SubFeature: TestSubFeature;
  };
  events: { loaded: TestFeatureLoadedEvent };
  collections: {
    test: TestCollection;
  };
  factories: {
    TestModelFactory: TestFactory;
  };
  models: {
    my: TestModel;
  };
  translations: {
    testTranslations: TestTranslations;
  };
};

export default class TestFeature
  extends Feature<TestFeatureType, TestApplication>
  implements IFeature<TestFeatureType, TestApplication> {
  name = 'TestFeature';
  components() {
    return {};
  }

  get defaultData(): Partial<TestFeatureData> {
    return {
      phone: '111111',
    };
  }

  get defaultConfig(): Partial<TestFeatureConfig> {
    return {
      name: 'default_name',
    };
  }

  initFeature() {
    return new Promise((resolve) => resolve(true)) as Promise<boolean>;
  }
}
