import FeatureInitializedEvent from '../../Events/Features/FeatureInitializedEvent';

describe('Events test', () => {
  it('Should work correctly', (done) => {
    const callbackOne = jest.fn();
    const callbackTwo = jest.fn();

    const event = new FeatureInitializedEvent();

    event.subscribe(callbackOne);
    event.subscribe(callbackTwo);
    event.subscribe((result) => {
      expect(result).toBe(true);
    });

    event.fire(true);

    expect(callbackOne).toHaveBeenCalled();
    expect(callbackTwo).toHaveBeenCalled();

    event.unsubscribe(callbackTwo);

    event.fire(true);

    expect(callbackOne).toHaveBeenCalledTimes(2);
    expect(callbackTwo).toHaveBeenCalledTimes(1);

    event.clear();

    expect(callbackOne).toHaveBeenCalledTimes(2);
    expect(callbackTwo).toHaveBeenCalledTimes(1);

    done();
  });
});
