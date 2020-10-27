import Feature from '../../../Models/Feature';
import TestFeatureLoadedEvent from '../Events/TestFeatureLoadedEvent';
import TestSubFeature from './TestSubFeature';
import TestModel from '../TestModels/TestModel';
import TestCollection from '../DataCollection/TestDataCollection';
import { IFeature } from '../../../Interfaces/IFeature';
import TestFactory from '../TestFactories/TestFactory';
import TestSlice from '../TestSlices/TestSlice';
import TestApplication from '../Application/TestApplication';

type TestFeatureConfig = {
  name: string;
  id: number;
};

type TestFeatureSubFeatures = {
  SubFeature: TestSubFeature;
};

export default class TestFeature
  extends Feature<TestFeatureConfig, TestApplication, TestFeatureSubFeatures>
  implements IFeature<TestFeatureConfig, TestApplication> {
  name = 'TestFeature';

  public readonly events = {
    loaded: new TestFeatureLoadedEvent(),
  };
  public readonly collections = {
    test: new TestCollection(),
  };

  public readonly factories = {
    TestModelFactory: new TestFactory(),
  };

  public readonly models = {
    my: new TestModel({ id: 2, name: 'test' }),
  };

  components() {
    return {};
  }

  initFeature() {
    return new Promise((resolve) => resolve(true)) as Promise<boolean>;
  }

  getSlice() {
    return {
      messages: TestSlice,
    };
  }
}
