import TestDataProvider from '../TestData/TestDataProviders/TestDataProvider';
import TestModel from '../TestData/TestModels/TestModel';
import TestDataManager from '../TestData/TestDataManager/TestDataManager';

describe('Data manager tests', () => {
  it('Should save and load data correctly', async () => {
    const provider = new TestDataProvider();
    const manager = new TestDataManager(provider);
    const newModel = new TestModel({
      id: 2,
      name: 'newModel',
    });

    const dataSavedListener = jest.fn();
    const dataLoadedListener = jest.fn();

    manager.events.DataSaved.subscribe(dataSavedListener);
    manager.events.DataLoaded.subscribe(dataLoadedListener);

    try {
      await manager.load('newModel');
    } catch (e) {
      expect(e).toBeNull();
    }

    const saveResult = await manager.save('newModel', newModel);
    expect(saveResult).toBeTruthy();
    expect(dataSavedListener).toBeCalled();

    const loadResult = await manager.load('newModel');
    expect(loadResult).toBeInstanceOf(TestModel);
    expect(loadResult).toStrictEqual(newModel);
    expect(loadResult?.fields.id).toBe(2);
    expect(loadResult?.fields.name).toBe('newModel');
  });
});
