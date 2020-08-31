import Factory from '../../Models/Factory';
import { TestFeature } from '../TestData';

describe('Factory test', () => {
  it('Should create correct class instance', () => {
    const createdClass = Factory.create(TestFeature, { id: 1, name: 'test' });
    expect(createdClass).toBeInstanceOf(TestFeature);
  });
});
