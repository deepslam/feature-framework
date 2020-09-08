import { IApp } from './../../../Interfaces/IApp';
import Application from '../../../Application/Application';
import TestFeature from '../SampleFeature/TestFeature';
import TestFactory from '../TestFactories/TestFactory';
import TestModel from '../TestModels/TestModel';

export type TestApplicationConfigType = {
  version: string;
};

export default class TestApplication
  extends Application<TestApplicationConfigType>
  implements IApp {
  reducers = {};
  features = {
    TestFeature: new TestFeature({ id: 2, name: 'test' }),
  };
  factories = {
    TestFactory: new TestFactory(TestModel),
  };
  translations = {};
}
