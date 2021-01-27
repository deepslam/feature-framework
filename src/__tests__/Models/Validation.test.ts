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
    expect(model.validate()).toHaveProperty('is_passed', false);

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
});
