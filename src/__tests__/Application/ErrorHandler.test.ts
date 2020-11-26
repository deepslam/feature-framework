import TestApp from '../TestData/Application/TestApplication';
import { ErrorTypeEnum } from '../../Types';

const eventCallback = jest.fn();

beforeEach(() => {
  eventCallback.mockClear();
});

describe('Error handlers test', () => {
  it('Should throw error on critical cases only', () => {
    const app = new TestApp({ version: '3.4.3' });

    expect(() => {
      app.err('test');
    }).not.toThrow();
    expect(() => {
      app.warning('test');
    }).not.toThrow();
    expect(() => {
      app.throwErr('test');
    }).toThrow();
  });

  it('Should correctly handle with events', () => {
    const app = new TestApp({ version: '3.4.3' });
    app.baseEvents.onAppError.subscribe(eventCallback);
    const consoleLoggerFunc = jest.spyOn(app.logger, 'log');

    app.err('test');
    expect(eventCallback).toHaveBeenCalledTimes(1);
    expect(eventCallback).toHaveBeenCalledWith({
      message: 'test',
      type: ErrorTypeEnum.error,
    });
    expect(consoleLoggerFunc).toHaveBeenCalledTimes(1);

    app.warning('test');
    expect(eventCallback).toHaveBeenCalledTimes(2);
    expect(eventCallback).toHaveBeenCalledWith({
      message: 'test',
      type: ErrorTypeEnum.warning,
    });
    expect(consoleLoggerFunc).toHaveBeenCalledTimes(2);

    try {
      app.throwErr('test');
    } catch (e) {}
    expect(eventCallback).toHaveBeenCalledTimes(3);
    expect(eventCallback).toHaveBeenCalledWith({
      message: 'test',
      type: ErrorTypeEnum.critical,
    });
    expect(consoleLoggerFunc).toHaveBeenCalledTimes(3);
  });

  it('Should correctly handle with standard and additional error handlers', () => {
    const app = new TestApp({ version: '3.4.3' });
    const errorHandlerFunc = jest.spyOn(app.errorHandler, 'handleError');
    const testErrorHandlerFunc = jest.spyOn(app.errorHandler, 'handleError');

    app.err('test');
    expect(testErrorHandlerFunc).toHaveBeenCalledTimes(1);
    expect(errorHandlerFunc).toHaveBeenCalledTimes(1);

    app.warning('test');
    expect(testErrorHandlerFunc).toHaveBeenCalledTimes(2);
    expect(errorHandlerFunc).toHaveBeenCalledTimes(2);

    try {
      app.throwErr('test');
    } catch (e) {}
    expect(testErrorHandlerFunc).toHaveBeenCalledTimes(3);
    expect(errorHandlerFunc).toHaveBeenCalledTimes(3);
  });
});
