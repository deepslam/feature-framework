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

        done();
      })
      .catch((e) => {
        done(e);
      });
  });
});
