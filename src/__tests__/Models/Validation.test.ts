import TestModel from '../TestData/TestModels/TestModel';
import TestModelWithRules from '../TestData/TestModels/TestModelWithRules';

describe('Validation models test', () => {
  it('Should correctly set and receice rules', () => {
    const modelWithDefaultRules = new TestModelWithRules({
      id: 2,
      name: 'Jacob',
    });

    const validationFailedListener = jest.fn();
    modelWithDefaultRules.baseEvents.onValidationFailed.subscribe(
      validationFailedListener,
    );

    const validationPassedListener = jest.fn();
    modelWithDefaultRules.baseEvents.onValidationPassed.subscribe(
      validationPassedListener,
    );

    const model = new TestModel({
      id: 1,
      name: 'John',
    });

    expect(model.getValidationRules()).toStrictEqual({});
    expect(modelWithDefaultRules.getValidationRules()).toStrictEqual({
      id: 'required|integer',
      name: 'required|min:3',
      surname: 'min:5',
    });

    model.setValidationRules({
      id: 'required',
      name: 'required|min:7',
      surname: 'required|min:2',
    });

    expect(model.getValidationRules()).toStrictEqual({
      id: 'required',
      name: 'required|min:7',
      surname: 'required|min:2',
    });

    expect(model.validate()).toHaveProperty('is_passed', false);
    expect(modelWithDefaultRules.validate()).toHaveProperty('is_passed', true);
    expect(validationPassedListener).toHaveBeenCalledTimes(1);
    expect(validationPassedListener).toHaveBeenCalledWith(
      modelWithDefaultRules.fields,
    );

    model.update({
      name: 'Steward',
      surname: 'Lee',
    });

    expect(model.validate()).toHaveProperty('is_passed', true);

    model.update({
      name: 'Bruce',
      surname: 'Lee',
    });

    const validationResult = model.validate();
    expect(validationResult).toHaveProperty('is_passed', false);
    expect(validationResult.errors.all()).toHaveProperty('name');
    expect(validationResult.errors.all().name).toHaveLength(1);

    modelWithDefaultRules.update({
      surname: 'O',
    });

    expect(modelWithDefaultRules.validate()).toHaveProperty('is_passed', false);
    expect(validationFailedListener).toHaveBeenCalledTimes(1);

    model.update({
      surname: 'Robinson',
    });

    expect(model.validate()).toHaveProperty('is_passed', false);
  });

  it('Should work with custom validation messages', () => {
    const model = new TestModel({
      id: 2,
      name: 'Jacob',
    });

    model.setValidationRules({
      id: 'required|digits_between:100,200',
      name: 'required|min:7',
      surname: 'required|min:10',
    });
    model.setValidationMessages({
      'digits_between.id': 'Incorrect id because this is the test',
      'min.name': 'Incorrect name because this is the test',
      'required.surname': 'Incorrect surname because this is the test',
    });

    const validationResult = model.validate();
    expect(validationResult).toHaveProperty('is_passed', false);
    expect(validationResult.errors.errors['id'][0]).toBe(
      'Incorrect id because this is the test',
    );
    expect(validationResult.errors.errors['name'][0]).toBe(
      'Incorrect name because this is the test',
    );
    expect(validationResult.errors.errors['surname'][0]).toBe(
      'Incorrect surname because this is the test',
    );
  });

  it('isValid function should work properly', () => {
    const model = new TestModel({
      id: 2,
      name: 'Jacob',
    });

    const validationFailedListener = jest.fn();
    model.baseEvents.onValidationFailed.subscribe(validationFailedListener);

    const validationPassedListener = jest.fn();
    model.baseEvents.onValidationPassed.subscribe(validationPassedListener);

    expect(model.isValid()).toBeTruthy();

    model.setValidationRules({
      id: 'required',
      name: 'required|min:3',
      surname: 'required|min:7',
    });

    expect(model.isValid()).toBeFalsy();
    expect(validationFailedListener).not.toHaveBeenCalled();
    expect(validationPassedListener).not.toHaveBeenCalled();

    model.update({
      id: 101,
      surname: 'Wolfkerson',
    });

    expect(model.isValid()).toBeTruthy();
    expect(validationFailedListener).not.toHaveBeenCalled();
    expect(validationPassedListener).not.toHaveBeenCalled();
  });

  it('validate function events should work properly', () => {
    const model = new TestModel({
      id: 2,
      name: 'Jacob',
    });

    model.setValidationRules({
      id: 'required',
      name: 'required|min:3',
      surname: 'required|min:7',
    });

    const validationFailedListener = jest.fn();
    model.baseEvents.onValidationFailed.subscribe(validationFailedListener);

    const validationPassedListener = jest.fn();
    model.baseEvents.onValidationPassed.subscribe(validationPassedListener);

    model.validate(false);

    expect(validationFailedListener).not.toHaveBeenCalled();
    expect(validationPassedListener).not.toHaveBeenCalled();

    model.validate(true);

    expect(validationFailedListener).toHaveBeenCalled();
    expect(validationPassedListener).not.toHaveBeenCalled();

    model.update({
      id: 101,
      surname: 'Wolfkerson',
    });

    jest.resetAllMocks();

    model.validate(false);

    expect(validationFailedListener).not.toHaveBeenCalled();
    expect(validationPassedListener).not.toHaveBeenCalled();

    model.validate(true);

    expect(validationFailedListener).not.toHaveBeenCalled();
    expect(validationPassedListener).toHaveBeenCalled();
  });
});
