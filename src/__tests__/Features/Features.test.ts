/* eslint-disable max-classes-per-file */
/* eslint-disable import/no-unresolved */
import { FeatureEvent } from 'Models/FeatureEvent';
import Feature from '../../Models/Feature';
import { IFeature, IEvent } from '../../Interfaces';

type TestFeatureConfig = {
  name: string;
  id: number;
};

type TestFeatureEvents = {
  loaded: IEvent<boolean>;
};

class TestFeature extends Feature<TestFeatureConfig, TestFeatureEvents, null> {
  components() {
    return {};
  }

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

class LoadedTestFeatureEvent extends FeatureEvent<boolean> {}

test('Features test', () => {
  const feature = new TestFeature({
    config: {
      id: 2,
      name: 'test',
    },
    events: {
      loaded: new LoadedTestFeatureEvent(),
    },
    slices: null,
  });

  feature.getEvents().loaded.fire(true);
  feature.getEvents().loaded.subscribe((result) => {
    console.log(result);
  });
});

it('Should be able to register a new feature', async () => {});
