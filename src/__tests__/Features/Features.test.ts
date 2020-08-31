import TestFeature from '../TestData/SampleFeature/TestFeature';

describe('Features test', () => {
  test('Features config test', () => {
    const feature = new TestFeature({
      id: 222,
      name: 'test',
    });

    expect(feature.getConfig()).toStrictEqual({
      id: 222,
      name: 'test',
    });

    feature.extendConfig({
      name: 'edited',
    });

    expect(feature.getConfig()).toStrictEqual({
      id: 222,
      name: 'edited',
    });

    /*
    feature.getSubFeatures().SubFeature.init();
    feature.getEvents().loaded.subscribe((result) => {
      console.log(result);
    });

    feature.getEvents().loaded.fire(true);
    */
  });

  test('Init test', async (done) => {
    const feature = new TestFeature({
      id: 222,
      name: 'test',
    });

    expect(feature.isInitialized()).toBeFalsy();

    expect(feature.features.SubFeature.isInitialized()).toBeFalsy();

    feature
      .init()
      .then((result) => {
        expect(result).toBeTruthy();
        expect(feature.isInitialized()).toBeTruthy();
        expect(feature.features.SubFeature.isInitialized()).toBeTruthy();
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('Events test', async () => {});
});
