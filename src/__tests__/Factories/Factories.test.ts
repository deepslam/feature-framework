import Factory from '../../Models/Factory';
import { TestFeature, TestModel, TestFactory } from '../TestData';

describe('A common factory test', () => {
  it('Create an instance', () => {
    const createdClass = Factory.create(TestFeature, {
      id: 1,
      name: 'test',
    });
    expect(createdClass).toBeInstanceOf(TestFeature);

    const createdModel = Factory.create(TestModel, {
      id: 323,
      name: 'test',
    });
    expect(createdModel).toBeInstanceOf(TestModel);
  });
});

describe('A model factory test', () => {
  it('Create an instance with the factory', () => {
    const idealModel = new TestModel({
      id: 332,
      name: 'test',
    });

    const factory = new TestFactory();
    const factoryModel = factory.new({
      id: 332,
      name: 'test',
    });

    const staticMethodModel = Factory.create(TestModel, {
      id: 332,
      name: 'test',
    });

    expect(factoryModel).toBeInstanceOf(TestModel);
    expect(staticMethodModel).toBeInstanceOf(TestModel);
    expect(idealModel).toBeInstanceOf(TestModel);
  });
});
