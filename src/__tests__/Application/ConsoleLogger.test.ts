import { ErrorTypeEnum } from '../../Types';

describe('ConsoleLogger test', () => {
  it('Should be called with log function', async () => {
    const TestApp = (await import('../TestData/Application/TestApplication'))
      .default;
    const app = new TestApp({ version: '3.4.3' });
    const consoleLoggerLogFunc = jest.spyOn(app.logger, 'log');
    const testLogggerLogFunc = jest.spyOn(app.additionalLoggers[0], 'log');

    app.log('test');
    expect(consoleLoggerLogFunc).toBeCalledTimes(1);
    expect(consoleLoggerLogFunc).toHaveBeenCalledWith(
      'test',
      ErrorTypeEnum.warning,
    );
    expect(testLogggerLogFunc).toBeCalledTimes(1);
    expect(testLogggerLogFunc).toHaveBeenCalledWith(
      'test',
      ErrorTypeEnum.warning,
    );

    app.log('testError', ErrorTypeEnum.error);
    expect(consoleLoggerLogFunc).toHaveBeenCalledWith(
      'testError',
      ErrorTypeEnum.error,
    );
    expect(testLogggerLogFunc).toHaveBeenCalledWith(
      'testError',
      ErrorTypeEnum.error,
    );

    app.log('testError', ErrorTypeEnum.info);
    expect(consoleLoggerLogFunc).toHaveBeenCalledWith(
      'testError',
      ErrorTypeEnum.info,
    );
    expect(testLogggerLogFunc).toHaveBeenCalledWith(
      'testError',
      ErrorTypeEnum.info,
    );

    app.log('testError', ErrorTypeEnum.critical);
    expect(consoleLoggerLogFunc).toHaveBeenCalledWith(
      'testError',
      ErrorTypeEnum.critical,
    );
    expect(testLogggerLogFunc).toHaveBeenCalledWith(
      'testError',
      ErrorTypeEnum.critical,
    );
  });

  it('Should be called with info function', async () => {
    const TestApp = (await import('../TestData/Application/TestApplication'))
      .default;
    const app = new TestApp({ version: '3.4.3' });
    const consoleLoggerLogFunc = jest.spyOn(app.logger, 'log');
    const testLogggerLogFunc = jest.spyOn(app.additionalLoggers[0], 'log');

    app.info('test');
    expect(consoleLoggerLogFunc).toBeCalledTimes(1);
    expect(testLogggerLogFunc).toBeCalledTimes(1);
    expect(consoleLoggerLogFunc).toHaveBeenCalledWith(
      'test',
      ErrorTypeEnum.info,
    );
    expect(testLogggerLogFunc).toHaveBeenCalledWith('test', ErrorTypeEnum.info);
  });
});
