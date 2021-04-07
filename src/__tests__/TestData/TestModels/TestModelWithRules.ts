import Model from '../../../Models/Model';

export type TestModelWithRulesFieldsType = {
  id: number;
  name: string;
  surname?: string;
};

export default class TestModelWithRules extends Model<TestModelWithRulesFieldsType> {
  public readonly events = {};
  public rules = {
    id: 'required|integer',
    name: 'required|min:3',
    surname: 'min:5',
  };
}
