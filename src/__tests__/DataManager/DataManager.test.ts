import FailedDataProvider from '../TestData/TestDataProviders/FailedDataProvider';
import BrokenDataProvider from '../TestData/TestDataProviders/BrokenDataProvider';
import TestModel from '../TestData/TestModels/TestModel';
import TestDataManager from '../TestData/TestDataManager/TestDataManager';

describe('Data manager tests', () => {
  it('Should work properly with DefaultDataProvider', async () => {
    const manager = new TestDataManager();
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

    const loadingResult = await manager.load('newModel');

    expect(loadingResult).toBe(null);
    expect(dataLoadingErrorListener).not.toBeCalled();
    expect(dataLoadedListener).not.toBeCalled();

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
});

describe('Tests with FailedDataProvider', () => {
  it('Should call error events', async () => {
    const manager = new TestDataManager();
    manager.provider = new FailedDataProvider();
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

describe('Tests with BrokenDataProvider', () => {
  it('Should work with the broken provider', async () => {
    const manager = new TestDataManager();
    const model = new TestModel({
      id: 2,
      name: 'model',
    });
    manager.provider = new BrokenDataProvider();
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

    expect(async () => {
      await manager.remove('newModel');
    }).rejects.toEqual(null);
    expect(dataRemovingErrorListener).toBeCalled();
  });
});
