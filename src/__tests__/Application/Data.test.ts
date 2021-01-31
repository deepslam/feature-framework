import TestApplication from '../TestData/Application/TestApplication';

describe('Application data manipulation test', () => {
  it('Should work correctly', () => {
    const app = new TestApplication({
      config: { version: '3.4.3' },
    });
    const appDataUpdatedEventListener = jest.fn();
    app.baseEvents.onDataUpdate.subscribe(appDataUpdatedEventListener);

    expect(app.data).toStrictEqual({});
    expect(app.data.appName).toBeUndefined();
    expect(app.data.purchased).toBeUndefined();

    app.updateData({
      appName: 'test',
      purchased: true,
    });

    expect(appDataUpdatedEventListener).toBeCalled();
    expect(appDataUpdatedEventListener).toBeCalledWith(app);

    expect(app.data).toStrictEqual({
      appName: 'test',
      purchased: true,
    });

    app.updateData({
      appName: 'test2',
    });

    expect(app.data).toStrictEqual({
      appName: 'test2',
      purchased: true,
    });

    app.updateData({
      purchased: false,
    });

    expect(app.data).toStrictEqual({
      appName: 'test2',
      purchased: false,
    });
  });
});
