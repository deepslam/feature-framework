import Model from '../../../Models/Model';

export type TestModelFieldsType = {
  id: number;
  name: string;
  occupation?: string;
};

export default class TestModelWithDefaultValues extends Model<TestModelFieldsType> {
  public readonly events = {};

  get defaultFieldValues(): Partial<TestModelFieldsType> {
    return {
      occupation: 'web developer',
    };
  }
}
