import TestModel from '../TestData/TestModels/TestModel';
import TestDataManager from '../TestData/TestDataManager/TestDataManager';
import FailedDataProvider from '../TestData/TestDataProviders/FailedDataProvider';
import BrokenDataProvider from '../TestData/TestDataProviders/BrokenDataProvider';

describe('Loading and saving models test', () => {
  it('Should be able to save and load models correctly', async () => {
    const savingKey = 'TestModelSaveKey';
    const manager = new TestDataManager();
    const savedEventListener = jest.fn();
    const loadedEventListener = jest.fn();
    const restoredModelLoadedEventListener = jest.fn();
    const model = new TestModel({
      id: 1,
      name: 'Richard',
    });

    model.baseEvents.onLoad.subscribe(loadedEventListener);
    model.baseEvents.onSave.subscribe(savedEventListener);

    const restoredModel = new TestModel({
      id: 0,
      name: 'None',
    });

    restoredModel.baseEvents.onLoad.subscribe(restoredModelLoadedEventListener);

    let loadingResult = await model.load(manager, savingKey);
    expect(loadingResult).toBeFalsy();
    expect(loadedEventListener).toBeCalledWith(false);

    const savingResult = await model.save(manager, savingKey);
    expect(savingResult).toBeTruthy();
    expect(savedEventListener).toBeCalledWith(true);

    loadingResult = await restoredModel.load(manager, savingKey);
    expect(restoredModelLoadedEventListener).toBeCalledWith(true);
    expect(restoredModel).toStrictEqual(model);
  });

  it('Check incorrect scenarious', async () => {
    const savingKey = 'TestModelSaveKey2';
    const manager = new TestDataManager();
    manager.provider = new FailedDataProvider();
    const model = new TestModel({
      id: 111,
      name: 'Sandy',
    });

    expect(() => model.load(manager, savingKey)).rejects;
    expect(() => model.save(manager, savingKey)).rejects;

    manager.provider = new BrokenDataProvider();

    expect(() => model.load(manager, savingKey)).rejects;
    expect(() => model.save(manager, savingKey)).rejects;
  });
});
