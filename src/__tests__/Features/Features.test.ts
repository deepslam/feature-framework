/* eslint-disable max-classes-per-file */
/* eslint-disable import/no-unresolved */
import { FeatureEvent } from '../../Models/Event';
import Feature from '../../Models/Feature';
import { IFeature, IEvent } from '../../Interfaces';

type TestFeatureConfig = {
  name: string;
  id: number;
};

type TestFeatureEvents = {
  loaded: IEvent<boolean>;
};

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
