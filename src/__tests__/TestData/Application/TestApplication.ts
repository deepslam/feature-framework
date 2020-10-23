import Application from '../../../Application/Application';
import TestFeature from '../SampleFeature/TestFeature';
import TestFactory from '../TestFactories/TestFactory';
import TestErrorHandler from '../TestErrorHandler/TestErrorHandler';
import TestLogger from '../TestLogger/TestLogger';
import { IErrorHandler, IApp, ILogger } from '../../../Interfaces';

export type TestApplicationConfigType = {
  version: string;
};

const TestFeatureInstance = new TestFeature({ id: 2, name: 'test' });

export default class TestApplication
  extends Application<TestApplicationConfigType>
  implements IApp {
  reducers = {
    messages: TestFeatureInstance.getSlice().messages.reducer,
  };
  features = {
    TestFeature: TestFeatureInstance,
  };
  factories = {
    TestFactory: new TestFactory(),
  };
  additionalErrorHandlers: IErrorHandler[] = [new TestErrorHandler()];
  additionalLoggers: ILogger[] = [new TestLogger(this)];
}
