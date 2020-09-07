import TestApplication from '../TestData/Application/TestApplication';
import TestFeature from '../TestData/SampleFeature/TestFeature';

const app = new TestApplication({ version: '1.0' });

describe('Features test', () => {
  test('Features config test', () => {
    const feature = new TestFeature(app, {
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
    const feature = new TestFeature(app, {
      id: 222,
      name: 'test',
    });

    const eventFeatureInitializedFunction = jest.fn();
    const eventSubFeatureInitializedFunction = jest.fn();
    feature.baseEvents.initialized.fire = eventFeatureInitializedFunction;
    feature.features.SubFeature.baseEvents.initialized.fire = eventSubFeatureInitializedFunction;

    expect(feature.isInitialized()).toBeFalsy();

    expect(feature.features.SubFeature.isInitialized()).toBeFalsy();

    expect(eventFeatureInitializedFunction).not.toHaveBeenCalled();
    expect(eventSubFeatureInitializedFunction).not.toHaveBeenCalled();

    feature
      .init()
      .then((result) => {
        expect(result).toBeTruthy();
        expect(feature.isInitialized()).toBeTruthy();
        expect(feature.features.SubFeature.isInitialized()).toBeTruthy();
        expect(eventFeatureInitializedFunction).toHaveBeenCalledTimes(1);
        expect(eventSubFeatureInitializedFunction).toHaveBeenCalledTimes(1);
        done();
      })
      .catch((e) => {
        done(e);
      });
  });
});
