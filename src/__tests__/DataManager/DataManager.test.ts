import TestDataProvider from '../TestData/TestDataProviders/TestDataProvider';
import FailedDataProvider from '../TestData/TestDataProviders/FailedDataProvider';
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
    const dataSavingErrorListener = jest.fn();
    const dataLoadedListener = jest.fn();
    const dataLoadingErrorListener = jest.fn();
    const dataRemovedListener = jest.fn();
    const dataRemovingErrorListener = jest.fn();

    manager.events.DataSaved.subscribe(dataSavedListener);
    manager.events.DataSavingError.subscribe(dataSavingErrorListener);
    manager.events.DataLoaded.subscribe(dataLoadedListener);
    manager.events.DataLoadingError.subscribe(dataLoadingErrorListener);
    manager.events.DataRemoved.subscribe(dataRemovedListener);
    manager.events.DataRemovingError.subscribe(dataRemovingErrorListener);

    try {
      await manager.load('newModel');
    } catch (e) {
      expect(e).toBeNull();
    }
    expect(dataLoadingErrorListener).toBeCalled();

    let removeResult = await manager.remove('newModel');
    expect(removeResult).toBeFalsy();
    expect(dataRemovingErrorListener).toBeCalled();

    const saveResult = await manager.save('newModel', newModel);
    expect(saveResult).toBeTruthy();
    expect(dataSavedListener).toBeCalled();
    expect(dataSavedListener).toBeCalledWith('newModel');

    const loadResult = await manager.load('newModel');
    expect(loadResult).toBeInstanceOf(TestModel);
    expect(loadResult).toStrictEqual(newModel);
    expect(loadResult?.fields.id).toBe(2);
    expect(loadResult?.fields.name).toBe('newModel');
    expect(dataLoadedListener).toBeCalled();
    expect(dataLoadedListener).toBeCalledWith(loadResult);

    removeResult = await manager.remove('newModel');
    expect(removeResult).toBeTruthy();
    expect(dataRemovedListener).toBeCalled();
  });

  it('Should call error events', async () => {
    const provider = new FailedDataProvider();
    const manager = new TestDataManager(provider);
    const model = new TestModel({
      id: 2,
      name: 'model',
    });

    const dataSavingErrorListener = jest.fn();
    const dataLoadingErrorListener = jest.fn();
    const dataRemovingErrorListener = jest.fn();

    manager.events.DataSavingError.subscribe(dataSavingErrorListener);
    manager.events.DataLoadingError.subscribe(dataLoadingErrorListener);
    manager.events.DataRemovingError.subscribe(dataRemovingErrorListener);

    try {
      await manager.load('newModel');
    } catch (e) {
      expect(dataLoadingErrorListener).toBeCalled();
    }

    try {
      await manager.save('newModel', model);
    } catch (e) {
      expect(dataSavingErrorListener).toBeCalled();
    }

    try {
      await manager.remove('newModel');
    } catch (e) {
      expect(dataRemovingErrorListener).toBeCalled();
    }
  });
});
