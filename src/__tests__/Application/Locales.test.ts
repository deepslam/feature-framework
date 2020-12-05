import { Locale } from 'locale-enum';
import TestApp from '../TestData/Application/TestApplication';

describe('Application should be able to manage locales', () => {
  it('Expect that default locale is en', () => {
    const app = new TestApp({ config: { version: '3.4.3' } });
    expect(app.fallbackLocale).toBe(Locale.en);
    expect(app.getCurrentLocale()).toBe(Locale.en);
    expect(app.getAvailableLocales()).toStrictEqual([Locale.en]);
  });

  it('Change locales test', () => {
    const changeLocalEventListener = jest.fn();
    const app = new TestApp(
      {
        config: {
          version: '3.4.3',
        },
      },
      {
        defaultLocale: Locale.en,
        locales: [Locale.ja_JP, Locale.en],
      },
    );
    app.baseEvents.onAppLocaleChanged.subscribe(changeLocalEventListener);
    expect(app.getCurrentLocale()).toBe(Locale.en);
    expect(app.getAvailableLocales()).toStrictEqual([Locale.ja_JP, Locale.en]);
    expect(app.isLocaleAvailable(Locale.ru)).toBe(false);
    expect(app.isLocaleAvailable(Locale.ja_JP)).toBe(true);
    expect(app.setCurrentLocale(Locale.ru)).toBe(false);
    expect(app.setCurrentLocale(Locale.ja_JP)).toBe(true);
    expect(changeLocalEventListener).toBeCalledWith(Locale.ja_JP);
    expect(changeLocalEventListener).toBeCalledTimes(1);
  });

  it('Different defaults test', () => {
    const app = new TestApp(
      { config: { version: '3.4.3' } },
      {
        defaultLocale: Locale.it,
        fallbackLocale: Locale.fr,
        locales: [Locale.it, Locale.fr],
      },
    );
    expect(app.fallbackLocale).toBe(Locale.fr);
    expect(app.getCurrentLocale()).toBe(Locale.it);
    expect(app.getAvailableLocales()).toStrictEqual([Locale.it, Locale.fr]);
  });
});
