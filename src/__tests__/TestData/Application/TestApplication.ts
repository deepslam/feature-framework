import { Locale } from 'locale-enum';
import Application from '../../../Application/Application';
import TestFeature from '../SampleFeature/TestFeature';
import TestFactory from '../TestFactories/TestFactory';
import TestModel from '../TestModels/TestModel';
import TestErrorHandler from '../TestErrorHandler/TestErrorHandler';
import TestLogger from '../TestLogger/TestLogger';
import { IErrorHandler, IApp, ILogger } from '../../../Interfaces';

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
  additionalErrorHandlers: IErrorHandler[] = [new TestErrorHandler()];
  additionalLoggers: ILogger[] = [new TestLogger(this)];
}
