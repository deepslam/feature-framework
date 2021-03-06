import TestFeature from '../TestData/TestFeatures/TestFeature';

describe('Features data test', () => {
  test('Default data test', () => {
    const feature = new TestFeature();

    expect(feature.data).toStrictEqual({
      phone: '111111',
    });
  });
  test('Should update data correctly', () => {
    const feature = new TestFeature();
    const onUpdateDataEventListener = jest.fn();

    feature.baseEvents.onDataUpdate.subscribe(onUpdateDataEventListener);

    expect(feature.data).toStrictEqual(feature.defaultData);
    expect(feature.data.name).toBeUndefined();
    expect(feature.data.phone).not.toBeUndefined();

    feature.updateData({
      name: 'John',
    });

    expect(onUpdateDataEventListener).toBeCalled();
    expect(onUpdateDataEventListener).toBeCalledWith(feature);

    expect(feature.data).toStrictEqual({
      name: 'John',
      phone: '111111',
    });

    feature.updateData({
      phone: '+447880092223',
    });

    expect(feature.data).toStrictEqual({
      name: 'John',
      phone: '+447880092223',
    });

    feature.updateData({
      name: 'Susanna',
    });

    expect(feature.data).toStrictEqual({
      name: 'Susanna',
      phone: '+447880092223',
    });
  });
});
