import DataCollection from '../../../Models/DataCollection';

export type TestType = {
  id: number;
  name: string;
};

export default class TestTypedCollection extends DataCollection<TestType> {}
