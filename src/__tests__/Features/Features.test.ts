import TestFeature from '../TestData/SampleFeature/TestFeature';
import TestApplication from '../TestData/Application/TestApplication';

describe('Features test', () => {
  test('Features config test', () => {
    const feature = new TestFeature({
      id: 222,
      name: 'test',
    });

    expect(feature.cfg()).toStrictEqual({
      id: 222,
      name: 'test',
    });

    feature.extendConfig({
      name: 'edited',
    });

    expect(feature.cfg()).toStrictEqual({
      id: 222,
      name: 'edited',
    });
  });

  test('Init test', async (done) => {
    const feature = new TestFeature({
      id: 222,
      name: 'test',
    });

    const secondFeature = new TestFeature({
      id: 223,
      name: 'Never initialized feature',
    });

    const eventFeatureInitializedFunction = jest.fn();
    const eventSubFeatureInitializedFunction = jest.fn();
    const secondEventFeatureInitializedFunction = jest.fn();
    secondFeature.baseEvents.initialized.subscribe(
      secondEventFeatureInitializedFunction,
    );
    feature.baseEvents.initialized.subscribe(eventFeatureInitializedFunction);
    feature.features.SubFeature.baseEvents.initialized.subscribe(
      eventSubFeatureInitializedFunction,
    );

    expect(feature.isInitialized()).toBeFalsy();

    expect(feature.features.SubFeature.isInitialized()).toBeFalsy();

    expect(eventFeatureInitializedFunction).not.toHaveBeenCalled();
    expect(eventSubFeatureInitializedFunction).not.toHaveBeenCalled();
    expect(secondEventFeatureInitializedFunction).not.toHaveBeenCalled();

    feature
      .init()
      .then((result) => {
        expect(result).toBeTruthy();
        expect(feature.isInitialized()).toBeTruthy();
        expect(feature.features.SubFeature.isInitialized()).toBeTruthy();
        expect(eventFeatureInitializedFunction).toHaveBeenCalledTimes(1);
        expect(eventSubFeatureInitializedFunction).toHaveBeenCalledTimes(1);
        expect(secondEventFeatureInitializedFunction).toHaveBeenCalledTimes(0);
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  test('Set app test', () => {
    const feature = new TestFeature({
      id: 222,
      name: 'test',
    });
    const app = new TestApplication({ version: '1.0' });

    expect(feature.hasApp()).toBeFalsy();
    expect(feature.setApp(app)).toBeTruthy();
    expect(feature.hasApp()).toBeTruthy();
    expect(feature.getApp()).toStrictEqual(app);
    expect(feature.setApp(app)).toBeFalsy();
  });
});
