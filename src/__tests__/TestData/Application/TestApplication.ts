import Application from '../../../Application/Application';
import TestFeature from '../SampleFeature/TestFeature';
import TestFactory from '../TestFactories/TestFactory';
import TestErrorHandler from '../TestErrorHandler/TestErrorHandler';
import TestLogger from '../TestLogger/TestLogger';
import { IErrorHandler, IApp, ILogger } from '../../../Interfaces';

export type TestApplicationConfigType = {
  version: string;
};

export type TestApplicationFeaturesType = {
  TestFeature: TestFeature;
};

export default class TestApplication
  extends Application<TestApplicationFeaturesType, TestApplicationConfigType>
  implements IApp {
  reducers = {
    // messages: TestFeatureInstance.getSlice().messages.reducer,
  };
  factories = {
    TestFactory: new TestFactory(),
  };
  additionalErrorHandlers: IErrorHandler[] = [new TestErrorHandler()];
  additionalLoggers: ILogger[] = [new TestLogger(this)];
}
