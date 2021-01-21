import TestModel from '../TestData/TestModels/TestModel';
import TestModelWithDefaultValues from '../TestData/TestModels/TestModelWithDefaultValues';

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

  it('Test model default values', () => {
    const instance = new TestModelWithDefaultValues({
      id: 223,
      name: 'Susanna',
    });

    expect(instance.defaultFieldValues).toStrictEqual({
      occupation: 'web developer',
    });
    expect(instance.fields.name).toBe('Susanna');
    expect(instance.fields.id).toBe(223);
    expect(instance.fields.occupation).toBe('web developer');
  });
});
