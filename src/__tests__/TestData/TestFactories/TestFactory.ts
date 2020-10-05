import Factory from '../../../Models/Factory';
import TestModel from '../TestModels/TestModel';

export default class TestFactory extends Factory<typeof TestModel> {
  model: typeof TestModel = TestModel;
}
