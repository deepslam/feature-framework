import TestApp from '../TestData/Application/TestApplication';

describe('Application init test', () => {
  it('Should be initialized correctly', async (done) => {
    const app = new TestApp({ version: '3.4.3' });
    const appLoadedListener = jest.fn();
    const featureLoadedListener = jest.fn();
    const subfeatureLoadedListener = jest.fn();

    app.features.TestFeature.baseEvents.initialized.subscribe(
      featureLoadedListener,
    );
    app.features.TestFeature.features.SubFeature.baseEvents.initialized.subscribe(
      subfeatureLoadedListener,
    );
    app.baseEvents.onAppLoaded.subscribe(appLoadedListener);
    expect(app.isInitialized()).toBeFalsy();
    expect(app.features.TestFeature.isInitialized()).toBeFalsy();
    expect(
      app.features.TestFeature.features.SubFeature.isInitialized(),
    ).toBeFalsy();

    app
      .init()
      .then((result) => {
        expect(result).toBeTruthy();
        expect(appLoadedListener).toBeCalled();
        expect(featureLoadedListener).toBeCalled();
        expect(subfeatureLoadedListener).toBeCalled();
        expect(app.isInitialized()).toBeTruthy();
        expect(app.features.TestFeature.isInitialized()).toBeTruthy();
        expect(
          app.features.TestFeature.features.SubFeature.isInitialized(),
        ).toBeTruthy();
        expect(app.features.TestFeature.hasApp()).toBeTruthy();
        expect(
          app.features.TestFeature.features.SubFeature.hasApp(),
        ).toBeTruthy();
        expect(app.features.TestFeature.getApp()).toStrictEqual(app);
        expect(
          app.features.TestFeature.features.SubFeature.getApp(),
        ).toStrictEqual(app);

        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('Application config test', () => {
    const app = new TestApp({ version: '1.2.2' });

    expect(app.cfg()).toStrictEqual({ version: '1.2.2' });

    app.extendConfig({
      version: '1.0',
    });

    expect(app.cfg()).toStrictEqual({ version: '1.0' });
  });
});
