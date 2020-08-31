import TestFeature from '../TestData/SampleFeature/TestFeature';

test('Features test', () => {
  const feature = new TestFeature({
    id: 222,
    name: 'test',
  });

  feature.getSubFeatures().SubFeature.init();

  feature.getEvents().loaded.fire(true);
  feature.getEvents().loaded.subscribe((result) => {
    console.log(result);
  });
});

it('Should be able to register a new feature', async () => {});
