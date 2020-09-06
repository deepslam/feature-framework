import Application from '../../../Application/Application';
import TestFeature from '../SampleFeature/TestFeature';

export type TestApplicationConfigType = {
  version: string;
};

export default class TestApplication extends Application<
  TestApplicationConfigType
> {
  reducers = {};
  features = {
    TestFeature: new TestFeature({ id: 2, name: 'test' }),
  };
  translations = {};
}
