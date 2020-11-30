import TestApp, {
  TestApplicationFeaturesType,
} from '../TestData/Application/TestApplication';
import TestFeature from '../TestData/SampleFeature/TestFeature';
import TestSubFeature from '../TestData/SampleFeature/TestSubFeature';

describe('Application init test', () => {
  it('Should initialize correctly', async (done) => {
    const app = new TestApp({ version: '3.4.3' });

    const appLoadedListener = jest.fn();
    const appFeatureInitializedListener = jest.fn();
    const featureLoadedListener = jest.fn();
    const subfeatureLoadedListener = jest.fn();
    const SubFeature = new TestSubFeature(
      {
        enabled: true,
      },
      {},
    );
    const Feature = new TestFeature(
      {
        name: 'test',
        id: 3434,
      },
      {
        SubFeature,
      },
    );

    const features: TestApplicationFeaturesType = {
      TestFeature: Feature,
    };

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
    }).toThrowError();
    expect(features.TestFeature.isInitialized()).toBeFalsy();
    expect(
      features.TestFeature.features.SubFeature.isInitialized(),
    ).toBeFalsy();

    app
      .init(features)
      .then((result) => {
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
    const app = new TestApp({ version: '3.4.3' });
    const SubFeature = new TestSubFeature(
      {
        enabled: true,
      },
      {},
    );
    const Feature = new TestFeature(
      {
        name: 'test',
        id: 3434,
      },
      {
        SubFeature,
      },
    );

    const features: TestApplicationFeaturesType = {
      TestFeature: Feature,
    };

    expect(features.TestFeature.isInitialized()).toBeFalsy();

    expect(() => {
      app.features();
    }).toThrowError();

    app.setFeatures(features);

    expect(() => {
      app.features();
    }).not.toThrowError();

    expect(features.TestFeature.isInitialized()).toBeFalsy();

    expect(app.features()).toStrictEqual(features);
  });

  it('Application config test', () => {
    const app = new TestApp({ version: '1.2.2' });
    const appUpdatedListener = jest.fn();

    app.baseEvents.onUpdate.subscribe(appUpdatedListener);

    expect(app.config).toStrictEqual({ version: '1.2.2' });

    app.extendConfig({
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
