import TestDataCollection from '../TestData/DataCollection/TestDataCollection';
import TestModel from '../TestData/TestModels/TestModel';

describe('Collections test', () => {
  it('Should manage with collections correctly', () => {
    const collection = new TestDataCollection();
    const modelOne = new TestModel({
      id: 1,
      name: 'Test model 1',
    });
    const modelTwo = new TestModel({
      id: 2,
      name: 'Test model 2',
    });
    const itemAddedCallback = jest.fn();
    const itemRemovedCallback = jest.fn();
    const collectionClearedCallback = jest.fn();
    collection.events.onItemAdded.subscribe(itemAddedCallback);
    collection.events.onItemRemoved.subscribe(itemRemovedCallback);
    collection.events.onCollectionCleared.subscribe(collectionClearedCallback);
    collection.events.onItemAdded.subscribe((item) => {
      expect(item).toBeInstanceOf(TestModel);
    });
    collection.events.onItemRemoved.subscribe((item) => {
      expect(item).toBeInstanceOf(TestModel);
    });
    collection.events.onCollectionCleared.subscribe((item) => {
      expect(item).toStrictEqual(collection);
    });

    expect(collection.length()).toBe(0);

    collection.add(modelOne);

    expect(collection.length()).toBe(1);
    expect(collection.contain(modelOne)).toBeTruthy();
    expect(itemAddedCallback).toHaveBeenCalled();

    collection.add(modelTwo);

    expect(itemAddedCallback).toHaveBeenCalledTimes(2);
    expect(collection.contain(modelTwo)).toBeTruthy();
    expect(collection.getAll()).toBeInstanceOf(Map);
    expect(collection.length()).toBe(2);

    collection.remove(modelOne);

    expect(collection.contain(modelOne)).toBeFalsy();
    expect(collection.length()).toBe(1);
    expect(itemRemovedCallback).toHaveBeenCalled();

    collection.clear();

    expect(collectionClearedCallback).toHaveBeenCalled();
    expect(collection.length()).toBe(0);
    expect(collection.contain(modelOne)).toBeFalsy();
    expect(collection.contain(modelTwo)).toBeFalsy();
  });
});
