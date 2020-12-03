import Factory from '../../Models/Factory';
import {
  TestFactory,
  TestFeature,
  TestModel,
  TestSubFeature,
  TestCollection,
  TestFeatureLoadedEvent,
} from '../TestData';

describe('A common factory test', () => {
  it('Create an instance', () => {
    const secondFeature = new TestSubFeature({
      config: {
        enabled: true,
      },
    });

    const createdClass = Factory.create(TestFeature, {
      config: {
        name: 'test',
        id: 222,
      },
      collections: {
        test: new TestCollection(),
      },
      models: {
        my: new TestModel({
          id: 2,
          name: 'test',
        }),
      },
      factories: {
        TestModelFactory: new TestFactory(),
      },
      events: {
        loaded: new TestFeatureLoadedEvent(),
      },
      features: {
        SubFeature: secondFeature,
      },
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
