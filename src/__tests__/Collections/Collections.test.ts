import { DataCollection } from '../../Models';
import TestDataCollection from '../TestData/DataCollection/TestDataCollection';
import TestTypedCollection, {
  TestType,
} from '../TestData/DataCollection/TestTypedCollection';
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
    expect(collection.isEmpty()).toBeTruthy();
    expect(collection.first()).toBeNull();
    expect(collection.last()).toBeNull();

    collection.add(modelOne);

    expect(collection.length()).toBe(1);
    expect(collection.isEmpty()).toBeFalsy();
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
    expect(collection.isEmpty()).toBeFalsy();
    expect(collection.first()).toStrictEqual(modelOne);
    expect(collection.last()).toStrictEqual(modelTwo);

    collection.remove(modelOne);

    expect(collection.contain(modelOne)).toBeFalsy();
    expect(collection.length()).toBe(1);
    expect(itemRemovedCallback).toHaveBeenCalled();

    collection.clear();

    expect(collectionClearedCallback).toHaveBeenCalled();
    expect(collection.length()).toBe(0);
    expect(collection.isEmpty()).toBeTruthy();
    expect(collection.contain(modelOne)).toBeFalsy();
    expect(collection.contain(modelTwo)).toBeFalsy();
  });

  it('Should be able to add elements in the beginning', () => {
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
    const collectionClearedCallback = jest.fn();
    collection.events.onItemAdded.subscribe(itemAddedCallback);
    collection.events.onCollectionCleared.subscribe(collectionClearedCallback);

    expect(collection.length()).toBe(0);
    expect(collection.first()).toBeNull();
    expect(collection.last()).toBeNull();

    collection.add(modelOne, false);

    expect(collection.length()).toBe(1);
    expect(collection.contain(modelOne)).toBeTruthy();
    expect(itemAddedCallback).toHaveBeenCalled();
    expect(collectionClearedCallback).not.toHaveBeenCalled();
    expect(collection.first()).toStrictEqual(modelOne);
    expect(collection.last()).toStrictEqual(modelOne);

    collection.add(modelTwo, false);

    expect(collection.length()).toBe(2);
    expect(collection.contain(modelOne)).toBeTruthy();
    expect(collection.contain(modelTwo)).toBeTruthy();
    expect(itemAddedCallback).toHaveBeenCalled();
    expect(collectionClearedCallback).not.toHaveBeenCalled();
    expect(collection.first()).toStrictEqual(modelTwo);
    expect(collection.last()).toStrictEqual(modelOne);

    expect(collection.getItems()).toBeInstanceOf(Map);
    expect(collection.getItems().has(modelOne)).toBeTruthy();
    expect(collection.getItems().has(modelTwo)).toBeTruthy();
    expect(collection.getItems().size).toBe(2);
  });

  it('Should be able to get element by index', () => {
    const modelOne = new TestModel({
      id: 1,
      name: 'Test model 1',
    });
    const modelTwo = new TestModel({
      id: 2,
      name: 'Test model 2',
    });
    const collection = new TestDataCollection([modelOne, modelTwo]);

    expect(collection.getByIndex(10)).toBe(null);
    expect(collection.getByIndex(-2)).toBe(null);
    expect(collection.getByIndex(0)).toStrictEqual(modelOne);
    expect(collection.getByIndex(1)).toStrictEqual(modelTwo);

    expect(collection.hasIndex(-2)).toBeFalsy();
    expect(collection.getByIndex(0)).toBeTruthy();
    expect(collection.getByIndex(1)).toBeTruthy();
    expect(collection.hasIndex(2)).toBeFalsy();
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
    const findCallBack = jest.fn();
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

    collection.find(findCallBack);

    expect(findCallBack.mock.calls[0]).toEqual([modelOne, 0]);
    expect(findCallBack.mock.calls[1]).toEqual([modelTwo, 1]);
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

    expect(collection.toArray()).toStrictEqual([
      modelOne,
      modelTwo,
      modelThree,
    ]);

    expect(collection).toStrictEqual(sortedByIdAscCollection);

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

    expect(collection.toArray()).toStrictEqual([
      modelThree,
      modelTwo,
      modelOne,
    ]);

    expect(collection).toStrictEqual(sortedByIdDescCollection);
    expect(sortedByIdAscCollection).toStrictEqual(sortedByIdDescCollection);
  });

  it('Should be fillable', () => {
    const collectionClearedCallback = jest.fn();
    const collectionFilledCallback = jest.fn();
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
    const modelFour = new TestModel({
      id: 4,
      name: 'Test model 4',
    });
    const collection = new TestDataCollection([modelOne]);
    collection.events.onCollectionCleared.subscribe(collectionClearedCallback);
    collection.events.onCollectionFilled.subscribe(collectionFilledCallback);

    collection.fill([modelTwo, modelThree]);

    expect(collection.toArray()).toStrictEqual([modelTwo, modelThree]);

    expect(collectionClearedCallback).toBeCalled();
    expect(collectionFilledCallback).toBeCalled();

    collection.fill([modelFour]);

    expect(collection.toArray()).toStrictEqual([modelFour]);
    expect(collectionClearedCallback).toBeCalledTimes(2);
    expect(collectionFilledCallback).toBeCalledTimes(2);
  });

  it('Should be extendable', () => {
    const collectionClearedCallback = jest.fn();
    const collectionExtendedCallback = jest.fn();
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
    const modelFour = new TestModel({
      id: 4,
      name: 'Test model 4',
    });
    const collection = new TestDataCollection([modelOne]);
    collection.events.onCollectionCleared.subscribe(collectionClearedCallback);
    collection.events.onCollectionExtended.subscribe(
      collectionExtendedCallback,
    );

    collection.extend([modelTwo, modelThree, modelFour]);

    expect(collection.toArray()).toStrictEqual([
      modelOne,
      modelTwo,
      modelThree,
      modelFour,
    ]);
    expect(collectionClearedCallback).not.toBeCalled();
    expect(collectionExtendedCallback).toBeCalled();
  });

  it('Map test', () => {
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
    const modelFour = new TestModel({
      id: 4,
      name: 'Test model 4',
    });

    const collection = new TestDataCollection([
      modelOne,
      modelTwo,
      modelThree,
      modelFour,
    ]);

    let currentIndex = 0;
    const newCollection = collection.map<string>((item, index: number) => {
      expect(index).toBe(currentIndex);
      currentIndex = currentIndex + 1;
      return item.fields.name;
    });

    expect(newCollection.toArray()).toStrictEqual([
      'Test model 1',
      'Test model 2',
      'Test model 3',
      'Test model 4',
    ]);
  });

  it('Find by key and value test', () => {
    const modelOne: TestType = {
      id: 1,
      name: 'Test model 1',
    };
    const modelTwo = {
      id: 2,
      name: 'Test model 2',
    };
    const modelThree = {
      id: 3,
      name: 'Test model 3',
    };
    const modelFour = {
      id: 4,
      name: 'Test model 4',
    };

    const collection = new TestTypedCollection([
      modelOne,
      modelTwo,
      modelThree,
      modelFour,
    ]);

    expect(collection.findByKeyValue('id', 5)).toBeNull();
    expect(collection.findByKeyValue('name', 'test')).toBeNull();

    expect(collection.findByKeyValue('id', 1)).toStrictEqual(modelOne);
    expect(collection.findByKeyValue('name', 'test model 1')).toBeNull();
    expect(collection.findByKeyValue('name', 'Test model 1')).toStrictEqual(
      modelOne,
    );

    expect(collection.findByKeyValue('id', 4)).toStrictEqual(modelFour);
    expect(collection.findByKeyValue('name', 'Test model 4')).toStrictEqual(
      modelFour,
    );
  });
});
