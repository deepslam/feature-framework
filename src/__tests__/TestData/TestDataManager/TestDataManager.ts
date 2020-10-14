import DataManager from '../../../Models/DataManager';
import TestModel from '../TestModels/TestModel';
import DefaultDataProvider from '../../../DataProviders/DefaultDataProvider';

export default class TestDataManager extends DataManager<TestModel> {
  provider: DefaultDataProvider = new DefaultDataProvider();

  protected restore(data: string): TestModel {
    const obj = JSON.parse(data);
    return new TestModel(obj);
  }
  protected pack(data: TestModel): string {
    return JSON.stringify(data);
  }
}
