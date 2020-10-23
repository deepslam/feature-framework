import TestModel from '../TestData/TestModels/TestModel';

describe('Application models test', () => {
  it('Should correctly store and read model fields', () => {
    const instance = new TestModel({
      id: 2,
      name: 'test',
    });

    const eventUpdatedFunc = jest.fn();
    instance.baseEvents.updated.subscribe(eventUpdatedFunc);
    expect(instance.fields.id).toBe(2);
    expect(instance.fields.name).toBe('test');

    instance.update({
      name: 'John',
    });

    expect(eventUpdatedFunc).toBeCalledTimes(1);
    expect(eventUpdatedFunc).toHaveBeenCalledWith(instance);
    expect(instance.fields.name).toBe('John');
    expect(instance.fields.id).toBe(2);

    instance.setField('name', 'eff');
    expect(eventUpdatedFunc).toBeCalledTimes(2);
    expect(eventUpdatedFunc).toHaveBeenCalledWith(instance);
  });
});
