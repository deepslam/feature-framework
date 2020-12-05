import LoadedTestFeatureEvent from '../TestData/Events/TestFeatureLoadedEvent';
import TestFeature from '../TestData/TestFeatures/TestFeature';
import TestApplication from '../TestData/Application/TestApplication';
import TestModel from '../TestData/TestModels/TestModel';
import TestSubFeature from '../TestData/TestFeatures/TestSubFeature';
import TestCollection from '../TestData/DataCollection/TestDataCollection';
import TestFactory from '../TestData/TestFactories/TestFactory';

describe('Features test', () => {
  test('Features config test', () => {
    const appFeatureUpdatedListener = jest.fn();
    const app = new TestApplication({ config: { version: '3.4.3' } });
    const SubFeature = new TestSubFeature({
      config: {
        enabled: true,
      },
    });
    const feature = new TestFeature({
      config: {
        name: 'test',
        id: 222,
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

    feature.setApp(app);
    app.baseEvents.onFeatureUpdated.subscribe(appFeatureUpdatedListener);

    expect(feature.cfg()).toStrictEqual({
      id: 222,
      name: 'test',
    });

    feature.extendConfig({
      name: 'edited',
    });

    expect(appFeatureUpdatedListener).toBeCalled();
    expect(appFeatureUpdatedListener).toBeCalledWith(feature);

    expect(feature.cfg()).toStrictEqual({
      id: 222,
      name: 'edited',
    });
  });

  test('Init test', async (done) => {
    const app = new TestApplication({ config: { version: '3.4.3' } });

    const secondFeature = new TestSubFeature({
      config: {
        enabled: true,
      },
    });
    const feature = new TestFeature({
      config: {
        name: 'test',
        id: 222,
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
        SubFeature: secondFeature,
      },
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

    app.setAppToFeatures({
      TestFeature: feature,
    });

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
        expect(secondEventFeatureInitializedFunction).toHaveBeenCalledTimes(1);
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  test('Empty feature init test', async () => {
    const app = new TestApplication({ config: { version: '3.4.3' } });
    const feature = new TestFeature();
    feature.setApp(app);

    expect(feature.isInitialized()).toBeFalsy();

    await feature.init();

    expect(feature.isInitialized()).toBeTruthy();
  });

  test('Set data test', async () => {
    const app = new TestApplication({ config: { version: '3.4.3' } });
    const secondFeature = new TestSubFeature({
      config: {
        enabled: true,
      },
    });

    const feature = new TestFeature();
    secondFeature.setApp(app);
    feature.setApp(app);

    expect(feature.isInitialized()).toBeFalsy();
    expect(
      feature.setData({
        config: {
          name: 'test',
          id: 222,
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
          SubFeature: secondFeature,
        },
      }),
    ).toBeTruthy();

    await feature.init();

    expect(feature.isInitialized()).toBeTruthy();
    expect(
      feature.setData({
        config: {
          name: 'test2',
          id: 223,
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
          SubFeature: secondFeature,
        },
      }),
    ).toBeFalsy();
    expect(feature.cfg()).toStrictEqual({
      name: 'test',
      id: 222,
    });
  });

  test('Partly set data test', async () => {
    const app = new TestApplication({ config: { version: '3.4.3' } });

    const feature = new TestFeature();
    feature.setApp(app);

    expect(feature.isInitialized()).toBeFalsy();
    expect(
      feature.setPartialData({
        config: {
          name: 'test',
          id: 222,
        },
      }),
    ).toBeTruthy();

    await feature.init();

    expect(feature.isInitialized()).toBeTruthy();
    expect(
      feature.setPartialData({
        config: {
          name: 'test2',
          id: 2245,
        },
      }),
    ).toBeFalsy();
    expect(feature.cfg()).toStrictEqual({
      name: 'test',
      id: 222,
    });
  });

  test('Set app test', () => {
    const secondFeature = new TestSubFeature({
      config: {
        enabled: true,
      },
    });
    const feature = new TestFeature({
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
        SubFeature: secondFeature,
      },
    });
    const app = new TestApplication({ config: { version: '1.0' } });

    expect(feature.hasApp()).toBeFalsy();
    expect(feature.setApp(app)).toBeTruthy();
    expect(feature.hasApp()).toBeTruthy();
    expect(feature.getApp()).toStrictEqual(app);
    expect(feature.setApp(app)).toBeFalsy();
  });

  test('Features factories test', () => {
    const secondFeature = new TestSubFeature({
      config: {
        enabled: true,
      },
    });
    const feature = new TestFeature({
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
        SubFeature: secondFeature,
      },
    });

    const model = feature.factories.TestModelFactory.new({
      id: 225,
      name: 'Dmitry',
      surname: 'Ivanov',
    });
    expect(model).toBeInstanceOf(TestModel);
  });
});
