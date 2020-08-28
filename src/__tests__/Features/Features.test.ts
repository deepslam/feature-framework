import Application from '../../Core/Application/Application';
import AbstractFeature from '../../Core/Models/AbstractFeature';
import IFeature from '../../Core/Interfaces/IFeature';

class TestFeature extends AbstractFeature implements IFeature {
  readonly id = 'TestFeature';

  getConfig() {
    return {};
  }

  initFeature() {
    return new Promise((resolve) => resolve(true)) as Promise<boolean>;
  }

  models() {
    return {};
  }

  screens() {
    return {};
  }
}

test('Features test', () => {});

it('Should be able to register a new feature', async () => {});
