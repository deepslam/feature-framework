import Feature from '../../Models/Feature';

class TestFeature extends Feature<
  {
    name: string;
    id: number;
  },
  {
    loaded: (item: boolean) => void;
  },
  {}
> {
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

test('Features test', () => {
  const feature = new TestFeature({});
});

it('Should be able to register a new feature', async () => {});
