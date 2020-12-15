import { DataCollection } from '../../Models';
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
    expect(collection.first()).toBeNull();
    expect(collection.last()).toBeNull();

    collection.add(modelOne);

    expect(collection.length()).toBe(1);
    expect(collection.contain(modelOne)).toBeTruthy();
    expect(itemAddedCallback).toHaveBeenCalled();
    expect(collection.first()).toStrictEqual(modelOne);
    expect(collection.last()).toStrictEqual(modelOne);

    collection.add(modelTwo);

    expect(itemAddedCallback).toHaveBeenCalledTimes(2);
    expect(collection.contain(modelTwo)).toBeTruthy();
    expect(collection.toArray()).toBeInstanceOf(Array);
    expect(collection.toArray()).toStrictEqual([modelOne, modelTwo]);
    expect(collection.length()).toBe(2);
    expect(collection.first()).toStrictEqual(modelOne);
    expect(collection.last()).toStrictEqual(modelTwo);

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

  it('Should be able to find elements', () => {
    const modelOne = new TestModel({
      id: 1,
      name: 'Test model 1',
    });
    const modelTwo = new TestModel({
      id: 2,
      name: 'Test model 2',
    });
    const collection = new TestDataCollection([modelOne, modelTwo]);
    const itemFoundCallback = jest.fn();
    collection.events.onItemsFound.subscribe(itemFoundCallback);

    let foundResult = collection.find((item) => item.fields.id === 3);

    expect(foundResult.length()).toBe(0);
    expect(foundResult).toBeInstanceOf(DataCollection);
    expect(foundResult).toBeInstanceOf(TestDataCollection);
    expect(itemFoundCallback).toHaveBeenCalled();
    expect(itemFoundCallback).toHaveBeenCalledWith(foundResult);

    foundResult = collection.find((item) => item.fields.id === 1);

    expect(foundResult.toArray()).toStrictEqual([modelOne]);
    expect(foundResult.length()).toBe(1);
    expect(foundResult).toBeInstanceOf(DataCollection);
    expect(foundResult).toBeInstanceOf(TestDataCollection);
    expect(itemFoundCallback).toHaveBeenCalled();
    expect(itemFoundCallback).toHaveBeenCalledWith(foundResult);

    foundResult = collection.find((item) => item.fields.name.includes('model'));

    expect(foundResult.toArray()).toStrictEqual([modelOne, modelTwo]);
    expect(foundResult.length()).toBe(2);
    expect(foundResult).toBeInstanceOf(DataCollection);
    expect(foundResult).toBeInstanceOf(TestDataCollection);
    expect(itemFoundCallback).toHaveBeenCalled();
    expect(itemFoundCallback).toHaveBeenCalledWith(foundResult);
  });

  it('Should be able to paginate results', () => {
    const modelOne = new TestModel({
      id: 1,
      name: 'Test model 1',
    });
    const modelTwo = new TestModel({
      id: 2,
      name: 'Test model 2',
    });
    const modelThree = new TestModel({
      id: 3,
      name: 'Test model 3',
    });
    const collection = new TestDataCollection([modelOne, modelTwo, modelThree]);

    expect(collection.paginate(1, 1)).toStrictEqual({
      allPages: 3,
      currentPage: 1,
      items: [modelOne],
    });

    expect(collection.paginate(2, 1)).toStrictEqual({
      allPages: 3,
      currentPage: 2,
      items: [modelTwo],
    });

    expect(collection.paginate(3, 1)).toStrictEqual({
      allPages: 3,
      currentPage: 3,
      items: [modelThree],
    });

    expect(collection.paginate(4, 1)).toStrictEqual({
      allPages: 3,
      currentPage: 4,
      items: [],
    });

    expect(() => {
      collection.paginate(0, 1);
    }).toThrowError();

    expect(() => {
      collection.paginate(1, 0);
    }).toThrowError();
  });

  it('Should be able to sort results', () => {
    const modelOne = new TestModel({
      id: 1,
      name: 'Test model 1',
    });
    const modelTwo = new TestModel({
      id: 2,
      name: 'Test model 2',
    });
    const modelThree = new TestModel({
      id: 3,
      name: 'Test model 3',
    });
    const collection = new TestDataCollection([modelTwo, modelOne, modelThree]);
    const collectionSortedCallback = jest.fn();
    collection.events.onItemsSorted.subscribe(collectionSortedCallback);

    expect(collection.toArray()).toStrictEqual([
      modelTwo,
      modelOne,
      modelThree,
    ]);

    const sortedByIdAscCollection = collection.sort((a, b) => {
      if (a.fields.id < b.fields.id) return -1;
      if (a.fields.id > b.fields.id) return 1;
      return 0;
    });

    expect(collectionSortedCallback).toBeCalled();
    expect(collectionSortedCallback).toBeCalledWith(sortedByIdAscCollection);
    expect(sortedByIdAscCollection.toArray()).toStrictEqual([
      modelOne,
      modelTwo,
      modelThree,
    ]);

    const sortedByIdDescCollection = collection.sort((a, b) => {
      if (a.fields.id > b.fields.id) return -1;
      if (a.fields.id < b.fields.id) return 1;
      return 0;
    });

    expect(collectionSortedCallback).toBeCalled();
    expect(collectionSortedCallback).toBeCalledWith(sortedByIdDescCollection);
    expect(sortedByIdDescCollection.toArray()).toStrictEqual([
      modelThree,
      modelTwo,
      modelOne,
    ]);
  });
});
