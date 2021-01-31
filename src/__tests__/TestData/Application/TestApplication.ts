import Application from '../../../Application/Application';
import TestFactory from '../TestFactories/TestFactory';
import TestErrorHandler from '../TestErrorHandler/TestErrorHandler';
import TestLogger from '../TestLogger/TestLogger';
import TestFeature from '../TestFeatures/TestFeature';
import { IApp } from '../../../Interfaces';
import { TestTranslations } from '../TestTranslations/TestTranslations';

export type TestApplicationConfigType = {
  version: string;
};

export type TestApplicationFeaturesType = {
  TestFeature: TestFeature;
};

export type TestApplicationType = {
  config: {
    version: string;
  };
  data: {
    purchased: boolean;
    appName: string;
  };
  features: {
    TestFeature: TestFeature;
  };
  factories: {
    TestFactory: TestFactory;
  };
  translations: {
    testTranslation: TestTranslations;
  };
};

export default class TestApplication
  extends Application<TestApplicationType>
  implements IApp<TestApplicationType> {
  additionalErrorHandlers: TestErrorHandler[] = [new TestErrorHandler()];
  additionalLoggers: TestLogger[] = [new TestLogger(this)];
}
