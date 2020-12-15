import TestApp, {
  TestApplicationFeaturesType,
} from '../TestData/Application/TestApplication';
import LoadedTestFeatureEvent from '../TestData/Events/TestFeatureLoadedEvent';
import TestCollection from '../TestData/DataCollection/TestDataCollection';
import TestFactory from '../TestData/TestFactories/TestFactory';
import TestFeature from '../TestData/TestFeatures/TestFeature';
import TestModel from '../TestData/TestModels/TestModel';
import TestSubFeature from '../TestData/TestFeatures/TestSubFeature';

describe('Application init test', () => {
  it('Should initialize correctly', async (done) => {
    const appLoadedListener = jest.fn();
    const appFeatureInitializedListener = jest.fn();
    const featureLoadedListener = jest.fn();
    const subfeatureLoadedListener = jest.fn();
    const SubFeature = new TestSubFeature({
      config: {
        enabled: true,
      },
    });
    const Feature = new TestFeature({
      config: {
        name: 'test',
        id: 3434,
      },
      collections: {
        test: new TestCollection(),
      },
      models: {
        my: new TestModel({
          id: 2,
          name: 'test',
        }),
      },
      factories: {
        TestModelFactory: new TestFactory(),
      },
      events: {
        loaded: new LoadedTestFeatureEvent(),
      },
      features: {
        SubFeature,
      },
    });

    const features: TestApplicationFeaturesType = {
      TestFeature: Feature,
    };

    const app = new TestApp({ config: { version: '3.4.3' } });

    features.TestFeature.baseEvents.initialized.subscribe(
      featureLoadedListener,
    );

    features.TestFeature.features.SubFeature.baseEvents.initialized.subscribe(
      subfeatureLoadedListener,
    );
    app.baseEvents.onAppLoaded.subscribe(appLoadedListener);
    app.baseEvents.onFeatureInitialized.subscribe(
      appFeatureInitializedListener,
    );
    expect(app.isInitialized()).toBeFalsy();
    expect(() => {
      app.features();
    }).not.toThrowError();
    expect(app.features()).toStrictEqual({});
    expect(features.TestFeature.isInitialized()).toBeFalsy();
    expect(
      features.TestFeature.features.SubFeature.isInitialized(),
    ).toBeFalsy();

    app
      .init({ features })
      .then((result) => {
        expect(app.features()).toStrictEqual(features);
        expect(result).toBeTruthy();
        expect(appLoadedListener).toBeCalled();
        expect(featureLoadedListener).toBeCalled();
        expect(subfeatureLoadedListener).toBeCalled();
        expect(appFeatureInitializedListener).toBeCalledTimes(2);
        expect(appFeatureInitializedListener.mock.calls).toEqual([
          [SubFeature],
          [Feature],
        ]);
        expect(app.isInitialized()).toBeTruthy();
        expect(app.features().TestFeature.isInitialized()).toBeTruthy();
        expect(
          app.features().TestFeature.features.SubFeature.isInitialized(),
        ).toBeTruthy();
        expect(app.features().TestFeature.hasApp()).toBeTruthy();
        expect(
          app.features().TestFeature.features.SubFeature.hasApp(),
        ).toBeTruthy();
        expect(app.features().TestFeature.getApp()).toStrictEqual(app);
        expect(
          app.features().TestFeature.features.SubFeature.getApp(),
        ).toStrictEqual(app);

        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('Application set features without initialization test', () => {
    const app = new TestApp({ config: { version: '3.4.3' } });
    const SubFeature = new TestSubFeature({
      config: {
        enabled: true,
      },
    });
    const Feature = new TestFeature({
      config: {
        name: 'test',
        id: 3434,
      },
      collections: {
        test: new TestCollection(),
      },
      models: {
        my: new TestModel({
          id: 2,
          name: 'test',
        }),
      },
      factories: {
        TestModelFactory: new TestFactory(),
      },
      events: {
        loaded: new LoadedTestFeatureEvent(),
      },
      features: {
        SubFeature,
      },
    });

    const features: TestApplicationFeaturesType = {
      TestFeature: Feature,
    };

    expect(features.TestFeature.isInitialized()).toBeFalsy();

    expect(() => {
      app.features();
    }).not.toThrowError();

    app.setFeatures(features);

    expect(() => {
      app.features();
    }).not.toThrowError();

    expect(features.TestFeature.isInitialized()).toBeFalsy();

    expect(app.features()).toStrictEqual(features);
  });

  it('Application config test', () => {
    const app = new TestApp({ config: { version: '1.2.2' } });
    const appUpdatedListener = jest.fn();

    app.baseEvents.onUpdate.subscribe(appUpdatedListener);

    expect(app.config).toStrictEqual({ version: '1.2.2' });

    app.updateConfig({
      version: '1.0',
    });

    expect(appUpdatedListener).toBeCalled();

    expect(app.config).toStrictEqual({ version: '1.0' });
    expect(appUpdatedListener).toBeCalledWith({ version: '1.0' });

    app.setConfig('version', '1.1');

    expect(app.config).toStrictEqual({ version: '1.1' });
    expect(appUpdatedListener).toBeCalledTimes(2);
    expect(appUpdatedListener).toBeCalledWith({ version: '1.1' });
  });
});
