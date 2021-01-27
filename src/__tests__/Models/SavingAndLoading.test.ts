import TestModel from '../TestData/TestModels/TestModel';
import TestDataManager from '../TestData/TestDataManager/TestDataManager';

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
});
