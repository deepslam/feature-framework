import TestModel from '../TestData/TestModels/TestModel';

describe('Application models test', () => {
  it('Should correctly store and read model fields', () => {
    const onUpdateListener = jest.fn();
    const onUpdateClonedListener = jest.fn();
    const instance = new TestModel({
      id: 2,
      name: 'test',
    });

    instance.baseEvents.onUpdate.subscribe(onUpdateListener);

    const clonedInstance = instance.clone();

    clonedInstance.baseEvents.onUpdate.subscribe(onUpdateClonedListener);

    expect(clonedInstance).toEqual(instance);

    instance.setField('name', 'edited');

    expect(onUpdateListener).toBeCalledTimes(1);
    expect(onUpdateClonedListener).not.toBeCalled();

    clonedInstance.setField('name', 'cloned');

    expect(clonedInstance).not.toEqual(instance);

    expect(onUpdateListener).toBeCalledTimes(1);
    expect(onUpdateClonedListener).toBeCalledTimes(1);

    expect(instance.fields).toStrictEqual({
      id: 2,
      name: 'edited',
    });

    expect(clonedInstance.fields).toStrictEqual({
      id: 2,
      name: 'cloned',
    });
  });
});
