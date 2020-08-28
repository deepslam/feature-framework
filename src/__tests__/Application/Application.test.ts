import { createApp } from '../../Application/Application';
import IApp from '../../Interfaces/IApp';

test('Application receives a correct instance', () => {
  expect(createApp({})).toBeInstanceOf(typeof IApp);
});

test('Application init test', async (done) => {
  const privateApp = (await import('../../Core/Application/Application'))
    .default;
  expect(privateApp.isInitialized).toBeFalsy();
  privateApp.init().then((result) => {
    expect(result).toBeTruthy();
    expect(App.isInitialized).toBeTruthy();
    done();
  });
});

describe('App environment test', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('Test that the app works in the test environment by default', () => {
    expect(App.env()).toBe('test');
    expect(() => {
      App.env();
    }).not.toThrow();
  });

  test('Try to change environment in the app', async () => {
    jest.mock('react-native-config', () => ({
      APP_ENVIRONMENT: 'mocked_value',
    }));

    const internalApp = (await import('../../Core/Application/Application'))
      .Application;

    expect(internalApp.getInstance().env()).toBe('mocked_value');
    expect(() => {
      internalApp.getInstance().env();
    }).not.toThrow();
  });

  test('Try to remove environment in the app', async () => {
    jest.mock('react-native-config', () => ({}));

    const internalApp = (await import('../../Core/Application/Application'))
      .Application;

    expect(() => {
      internalApp.getInstance().env();
    }).toThrow();
  });
});

describe('App config test', () => {
  test('Try to register new configs in the app', async () => {
    const appConfig = {
      test: 'test',
    };

    App.registerConfig('app', appConfig);

    expect(App.cfg('app.test')).toBe('test');
    expect(App.cfg('app')).toEqual(appConfig);

    App.registerConfig('app', {
      newFeature: 'test777',
    });

    expect(App.cfg('app.newFeature')).toBe('test777');
  });
});

describe('App languages test', () => {
  test('Check defaults', () => {
    expect(App.getCurrentLanguage()).toBe('en');
    expect(App.getAvailableLanguages()).toStrictEqual([]);
    expect(App.isLanguageAvailable('en')).toBeTruthy();
    expect(App.isLanguageAvailable('es')).toBeFalsy();
  });

  test('Try to change language', () => {
    App.setAvailableLanguages(['ru', 'rU', 'RU']);
    expect(App.getAvailableLanguages()).toStrictEqual(['ru']);
    expect(App.isLanguageAvailable('en')).toBeTruthy();
    expect(App.isLanguageAvailable('ru')).toBeTruthy();
    expect(App.isLanguageAvailable('es')).toBeFalsy();
    expect(App.getCurrentLanguage()).toBe('en');

    expect(App.setCurrentLanguage('es')).toBeFalsy();
    expect(App.setCurrentLanguage('ru')).toBeTruthy();
    expect(App.getCurrentLanguage()).toBe('ru');
  });
});
