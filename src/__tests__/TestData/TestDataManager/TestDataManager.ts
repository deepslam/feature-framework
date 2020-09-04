import DataManager from '../../../Models/DataManager';
import TestModel from '../TestModels/TestModel';
import TestDataProvider from '../TestDataProviders/TestDataProvider';

export default class TestDataManager extends DataManager<TestModel> {
  provider: TestDataProvider = new TestDataProvider();

  protected restore(data: string): TestModel {
    const obj = JSON.parse(data);
    return new TestModel(obj);
  }
  protected pack(data: TestModel): string {
    return JSON.stringify(data);
  }
}
