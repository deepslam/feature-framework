import TestModel from '../TestData/TestModels/TestModel';

describe('Application models test', () => {
  it('Should correctly store and read model fields', () => {
    const instance = new TestModel({
      id: 2,
      name: 'test',
    });

    expect(instance.fields.id).toBe(2);
    expect(instance.fields.name).toBe('test');

    instance.update({
      name: 'John',
    });

    expect(instance.fields.name).toBe('John');
    expect(instance.fields.id).toBe(2);
  });
});
