import AbstractModel from '../../Core/Models/AbstractModel';

class SampleModel extends AbstractModel {
  public name: string = '';

  public email: string = '';
}

test('Try to store and restore the model', async (done) => {
  const idealModel = new SampleModel();
  idealModel.name = 'test';
  idealModel.email = 'deepslam@gmail.com';

  const json = JSON.stringify(idealModel);

  const restoredModel = SampleModel.restoreFromJSON(json);

  expect(idealModel).toEqual(restoredModel);
  expect(restoredModel).toBeInstanceOf(SampleModel);
  expect(restoredModel.name).toBe('test');
  expect(restoredModel.email).toBe('deepslam@gmail.com');

  idealModel.name = 'new';
  expect(restoredModel.name).toBe('test');
  expect(idealModel.name).toBe('new');

  done();
});
