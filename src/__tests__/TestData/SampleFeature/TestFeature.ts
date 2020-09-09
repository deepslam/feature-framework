import Feature from '../../../Models/Feature';
import TestFeatureLoadedEvent from '../Events/TestFeatureLoadedEvent';
import TestSubFeature from './TestSubFeature';
import TestModel from '../TestModels/TestModel';
import TestCollection from '../DataCollection/TestDataCollection';
import { IFeature } from '../../../Interfaces/IFeature';

type TestFeatureConfig = {
  name: string;
  id: number;
};

export default class TestFeature
  extends Feature<TestFeatureConfig>
  implements IFeature<TestFeatureConfig> {
  public readonly features = {
    SubFeature: new TestSubFeature({ enabled: false }),
  };
  public readonly events = {
    loaded: new TestFeatureLoadedEvent(),
  };
  public readonly collections = {
    test: new TestCollection(),
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
}
