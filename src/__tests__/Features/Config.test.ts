import TestFeature from '../TestData/TestFeatures/TestFeature';

describe('Features config test', () => {
  test('Default config test', () => {
    const feature = new TestFeature();

    expect(feature.config).toStrictEqual({
      name: 'default_name',
    });
  });
  test('Should update config correctly', () => {
    const feature = new TestFeature();
    const onUpdateEventListener = jest.fn();

    feature.baseEvents.onUpdate.subscribe(onUpdateEventListener);

    expect(feature.config).toStrictEqual(feature.defaultConfig);
    expect(feature.config.id).toBeUndefined();
    expect(feature.config.name).not.toBeUndefined();

    feature.updateConfig({
      id: 1,
    });

    expect(onUpdateEventListener).toBeCalled();
    expect(onUpdateEventListener).toBeCalledWith(feature);

    expect(feature.config).toStrictEqual({
      id: 1,
      name: 'default_name',
    });

    feature.updateConfig({
      name: 'test name',
    });

    expect(feature.config).toStrictEqual({
      name: 'test name',
      id: 1,
    });

    feature.updateConfig({
      id: 3,
    });

    expect(feature.config).toStrictEqual({
      name: 'test name',
      id: 3,
    });
  });
});
