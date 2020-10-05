import Model from '../../../Models/Model';

export type TestModelFieldsType = {
  id: number;
  name: string;
  surname?: string;
};

export default class TestModel extends Model<TestModelFieldsType> {
  public readonly events = {};
}
